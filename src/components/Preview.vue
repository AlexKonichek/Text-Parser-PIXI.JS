<template>
<div>
  <button class="btn btn-success btn-lg m-3"  v-on:click="drawPixi">Finish preview</button>
  <canvas id="pixiPreview"></canvas>
  <div>
    <label class="text-white h4 mt-2"  for="symbols"></label>
    <div class="input-group input-group-lg mb-2">
      <input
          type="text"
          id="symbols"
          class="form-control mr-3"
          v-model="inputSymbols"
          required
          placeholder="USD"
      >
    </div>

  </div>

</div>
</template>

<script>
import * as PIXI from "pixi.js";

export default {
  name: "Preview",
  data() {
    return {
      app:{},
      canvasBackground: 0xffffff,
      canvasWidths:500,
      canvasHeight:200,
      inputSymbols:"",
      symbolsArr:[],
      texturesForRender:[],
      itemsArr:[],
      spritesheetWrapper:null,
      currentX:0,
      arrCorrectSymbols: [],
      symbolsArrUpper:[],
      startCoordinateForNextSymbol:0,

    }
  },
  props:["arrSymbolsParams", "textures"],
  watch: {
    arrSymbolsParams: function () {
      console.log(this.arrSymbolsParams[0].xoffset)
    },
    inputSymbols: function () {
      this.symbolsArr = []
      this.symbolsArr = this.inputSymbols.split("").map(symbol => symbol.toUpperCase());
      this.symbolsArr.forEach(symbol => {
                this.validateSymbolsForm(symbol)
        })
      console.warn("inputSymbols is changed", this.symbolsArr)
      if(this.symbolsArr.length>0) {
        this.symbolsArr.forEach(symbol => {
          let currentSymbol = this.arrSymbolsParams.filter(item => item.symbol === symbol)[0]
          console.log(currentSymbol)
          this.addSymbol(currentSymbol.width, currentSymbol.xoffset, currentSymbol.x, currentSymbol.y,)
        })
      }
    },
  },
  computed: {

  },
  methods: {
    drawPixi() {
      console.warn("drawPixi")
      let canvas = document.getElementById('pixiPreview')
      this.app = new PIXI.Application({
        width: this.canvasWidths,
        height: this.textures[0].frame.height+10,
        antialias: true,
        transparent: true,
        view: canvas,
      })
      this.app.renderer.backgroundColor = 0xffffff
      this.addCanvasBorder()
    },
    prepareSymbolsArray (currentSymbol){
      console.warn("prepareSymbolsArray")


    },

    correctSymbolsCoordinates(){
      let currentX = 0
      let allXoffset = 0
      this.itemsArr.forEach((sybmol, index) => {
        //xoffset = item.xoffset
        //correcting x coordinate with xoffset
        allXoffset = allXoffset + sybmol.xoffset
        //record  new symbols coordinate in array
        this.arrCorrectSymbols.push({xActual: currentX + allXoffset, x:sybmol.x, y:sybmol.y, symbol: sybmol.symbol})
        //corect currentX for next itteration
        currentX = currentX+ sybmol.width
      })
      if(this.arrCorrectSymbols.length === this.symbolsArr.length){
        this.render()
      }
      else{
       return
      }
    },

    render(){
      console.warn("render")
      this.clearStage()
      this.arrCorrectSymbols.forEach((item,i) => {
        this.addSymbol(item.width, item.xoffset, item.x, item.y)
      })
    },
    addSymbol(width, xoffset, x, y) {
      debugger
      console.warn("addSymbol")
      let texture = this.textures[this.getTextureIndex(x, y)]
      let spriteContainer = new PIXI.Container()
      let symbolSprite = PIXI.Sprite.from(texture);
      spriteContainer.x = this.currentX
      spriteContainer.y = 0
      spriteContainer.addChild(symbolSprite)
      this.spritesheetWrapper.addChild(spriteContainer)
      this.currentX = width + xoffset
    },
    getTextureIndex(x,y) {
      let index = this.textures.findIndex(texture => texture.frame.x === x && texture.frame.y === y );
      return index
    },
    addCanvasBorder() {
       this.spritesheetWrapper = new PIXI.Container()
      let spriteSheetBorder = new PIXI.Graphics();
      spriteSheetBorder.lineStyle(2, 0x000000, 1);
      spriteSheetBorder.drawRect(0, 0, this.canvasWidths, this.canvasHeight);
      spriteSheetBorder.endFill();
      spriteSheetBorder.x = 0;
      spriteSheetBorder.y = 0;
      this.spritesheetWrapper.addChild(spriteSheetBorder)
      this.app.stage.addChild(this.spritesheetWrapper);
    },

    clearStage() {
      console.warn("clearStage")

      if(this.app && this.app.stage.children.length>0){
        while(this.app.stage.children[1]) {
          this.app.stage.removeChild(this.app.stage.children[1])
        }
      }

    },
    validateSymbolsForm(symbol) {
      console.warn("validateSymbolsForm")
      let arrSymbolsNames = this.arrSymbolsParams.map(item => item.symbol)
      if(!arrSymbolsNames.includes(symbol)) {
        this.inputSymbols = this.inputSymbols.substring(0, this.inputSymbols.length - 1);
        this.symbolsArr.pop()
      }
    }

  }
}

</script>

<style scoped>

</style>