<template>
<div>
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
  <button class="btn btn-secondary btn-lg m-3"  v-on:click="clearStagePreview">Clear</button>

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
      firstTime: true

    }
  },
  props:["arrSymbolsParams", "textures", "symbolsMap"],
  watch: {
    arrSymbolsParams: function () {
       console.warn(this.arrSymbolsParams)
    },
    inputSymbols: function () {
      this.symbolsArr = []
      //this.clearStagePreview()
      this.symbolsArr = this.inputSymbols.split("").map(symbol => symbol.toUpperCase());
      let lastSymbol = this.symbolsArr[this.symbolsArr.length - 1]
      this.validateSymbolsForm(lastSymbol)
                this.addSymbol(lastSymbol)
      console.warn("inputSymbols is changed", this.symbolsArr)
      
    },
  },
  mounted() {
    this.drawPixi()
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
      /* let currentX = 0
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
       return */
     // }
    },

    render(){
     /*  console.warn("render")
      this.clearStage()
      this.arrCorrectSymbols.forEach((item,i) => {
        this.addSymbol(item.width, item.xoffset, item.x, item.y)
      }) */
    },
    addSymbol(currentSymbol) {
      console.warn("addSymbol")
        let params = this.symbolsMap.get(currentSymbol)
        console.warn(params)
        let spriteContainer = new PIXI.Container()
        let symbolSprite = PIXI.Sprite.from(params.texture);
        if(this.firstTime){
          spriteContainer.x = this.currentX
        }else{
          spriteContainer.x = this.currentX + params.xoffset
        }
        spriteContainer.y = 0
        spriteContainer.addChild(symbolSprite)
        this.spritesheetWrapper.addChild(spriteContainer)
        this.currentX = spriteContainer.x + params.width
        this.firstTime = false
        
        

      
      
    },
    /* getTextureIndex(x,y) {
      let index = this.textures.findIndex(texture => texture.frame.x === x && texture.frame.y === y );
      return index
    }, */
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
    clear(){
      console.warn("clearStage")

    },

    clearStagePreview() {
      if(this.app && this.app.stage.children.length>0){
       console.warn("clearStage",this.app.stage)
       this.app.stage.children.forEach((element, index) => {
         if(index===1){
           console.log(element)
           return
         }
         else{
           this.app.stage.removeChild(element)
         }

         
       });
      }

    },
    validateSymbolsForm(symbol) {
      console.warn("validateSymbolsForm")
      if(!this.symbolsMap.has(symbol)) {
        this.inputSymbols = this.inputSymbols.substring(0, this.inputSymbols.length - 1);
        this.symbolsArr.pop()
      }
    }

  }
}

</script>

<style scoped>

</style>