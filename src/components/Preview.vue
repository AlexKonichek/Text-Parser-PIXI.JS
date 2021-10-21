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
          v-on:change="onInputHandler"
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
      arrCorrectSymbols: []

    }
  },
  props:["arrSymbolsParams", "textures"],
  watch: {
    arrSymbolsParams: function () {
      console.log(this.arrSymbolsParams[0].xoffset)
    },
    inputSymbols: function () {
      this.symbolsArr = []
      this.symbolsArr = this.inputSymbols.split("");
      this.symbolsArr = this.symbolsArr.map(symbol => symbol.toUpperCase())
      console.log("inputSymbols is changed", this.symbolsArr)
      //this.validateSymbolsForm()
      this.startPrerendering()
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

    onInputHandler(e){
      this.inputSymbols = e.target.value
      this.symbolsArr = this.inputSymbols.split("");
    },

    startPrerendering() {
      console.warn("startPrerendering",this.symbolsArr)
      if( this.symbolsArr.length > 0 ){
        this.symbolsArr.forEach(symbol => this.prepareSymbolsArray(symbol.toUpperCase()))
      }
    },

    prepareSymbolsArray(currentSymbol){
      console.warn("prepareSymbolsArray")
      this.arrSymbolsParams.forEach(symbol => {
        if(symbol.symbol === currentSymbol){
          this.itemsArr.push(symbol)
        }
        else return
      })
      console.log(this.itemsArr,this.symbolsArr )
      if(this.itemsArr.length === this.symbolsArr.length ) {

        this.correctSymbolsCoordinates()
      }
      else {
        //throw Error("itemsArr.length not equal to symbolsArr.length ")
      }
    },
    correctSymbolsCoordinates(){
      debugger
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
        throw new Error("arrCorrectSymbols is empty")
      }
    },

    render(){
      console.warn("render")
      this.clearStage()
      this.arrCorrectSymbols.forEach((item,i) => {
        this.addSymbol(item.xActual,item.x, item.y, false)
      })
    },
    addSymbol(xActual, x, y, border) {
      console.warn("addSymbol")
      let texture = this.textures[this.getTextureIndex(x, y)]
      let spriteContainer = new PIXI.Container()
      let symbolSprite = PIXI.Sprite.from(texture);
      spriteContainer.x = xActual
      spriteContainer.y = 0
      spriteContainer.addChild(symbolSprite)
      this.spritesheetWrapper.addChild(spriteContainer)
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

  }
}

</script>

<style scoped>

</style>