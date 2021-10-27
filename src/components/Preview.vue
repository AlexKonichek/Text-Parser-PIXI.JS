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

  <button v-if="showRenderSymbolsButton" class="btn btn-success btn-lg m-3"  v-on:click="renderSymbols">Render</button>
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
      canvasWidths:600,
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
      firstTime: true,
      spriteBorder:null,
      showRenderSymbolsButton:false,
      showBorder:false,
      arrSymbolsCurrencyForDefaultPreview: ["U","S","D"],

    }
  },
  props:["arrSymbolsParams", "textures", "symbolsMap"],
  watch: {
    arrSymbolsParams: function () {
       console.warn(this.arrSymbolsParams)
    },
    inputSymbols: function () {
      console.warn("inputSymbols", this.symbolsArr)
      if(this.inputSymbols.length===0){
        return
      }

      let lastSymbol;
      //this.clearStagePreview()
     if(this.inputSymbols.length>0){
       this.symbolsArr = this.inputSymbols.split("").map(symbol => symbol.toUpperCase());
       lastSymbol = this.symbolsArr[this.symbolsArr.length - 1]
     }

      this.validateSymbolsForm(lastSymbol)
      console.warn("inputSymbols is changed", this.symbolsArr)
      
    },
    showBorder: function () {

    }
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
      this.renderDefaultPreview()
    },

    renderDefaultPreview(){
      debugger
      let arrDefaultSymbols = []
      this.arrSymbolsCurrencyForDefaultPreview.forEach(defaultSymbol => {
        if(this.symbolsMap.has(defaultSymbol)){
          console.log(this.symbolsMap.get(defaultSymbol))
          arrDefaultSymbols.push(this.symbolsMap.get(defaultSymbol))
        }
      })
      //sort symbols in right order
      arrDefaultSymbols.sort(function(a, b){
        if(a < b) { return -1; }
        if(a > b) { return 1; }
        return 0;
      })
      debugger
      arrDefaultSymbols.forEach(symbol => this.addSymbol(symbol.name))
      console.warn(arrDefaultSymbols)

    },
    renderSymbols(){
      this.clearStagePreview()
      this.symbolsArr.forEach(symbolName=> {
        this.addSymbol(symbolName)
      })
    },

    addSymbol(currentSymbol) {

      console.warn("addSymbol", currentSymbol)

      if(currentSymbol){
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
        //this.spritesheetWrapper.addChild(spriteContainer)
        let spriteSheetBorder = new PIXI.Graphics();
        spriteSheetBorder.lineStyle(3, 0x000000, 1);
        spriteSheetBorder.drawRect(0, 0, params.width, params.height);
        spriteSheetBorder.endFill();
        if(this.showBorder){
          spriteContainer.addChild(spriteSheetBorder)
        }
        this.app.stage.addChild(spriteContainer)
        this.currentX = spriteContainer.x + params.width
        this.firstTime = false
        console.log(spriteContainer)
      }
    },

    clearStagePreview() {
      console.warn("clearStagePreview")
      this.firstTime = true
      while(this.app.stage.children[0]) {
        this.app.stage.removeChild(this.app.stage.children[0]);
        this.inputSymbols = []
        this.symbolsArr = []
        this.currentX = 0
      }

    },
    validateSymbolsForm(symbol) {

      console.warn("validateSymbolsForm")
      if(!this.symbolsMap.has(symbol)) {
        this.inputSymbols = this.inputSymbols.substring(0, this.inputSymbols.length - 1);
        this.symbolsArr.pop()
      }
      this.showRenderSymbolsButton = true
    }
  }
}

</script>

<style scoped>

</style>