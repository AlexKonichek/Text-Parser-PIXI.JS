<template>
  <div class="w-100">
    <button  v-if="showRenderButton" class="btn btn-light btn-lg mt-3"  v-on:click="drawPixi">Correct XAdvance</button>
    <div class="col-sm-6">
      <canvas id="pixi"></canvas>
    </div>
    <div class="col-sm-6">

    </div>

  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
export default {
  name: 'Renderer',
  data() {
    return {
      firstSymbolIndex:5,
      canvasWidths:400,
      spritesheetWrapper:null,
      spriteSheetBorder:null,
      app:{},
      loader:{},
      sprites:[],
      textures:[],
      rotation: 0,
      //width: 1800,
      //height: 800,
      backgroundColor: 0xFF0000,
      resolution: 1,
      position: 1,
      x: 0,
      y: 0,
      showRenderButton:true
    }
  },
  props: ["canvasHeight", "loadedJSON","loadedPNG","xoffset","showRenderer","jsonHasSmallSymbols", "finalSmallXAdvance","comaSymbolParams", "dotIndex","symbolWidth","secondSymbolParams"],
  computed: {
   
   smallSymbolsXoffset() {
     return (this.finalSmallXAdvance - this.comaSymbolParams.width)/2
   },
    
    shiftXSmall() {
      return this.xoffsetSmall
    },
    itemWidth() {
      return this.symbolWidth
    },
    comaSymbol() {
      let params = {
        width:0,x:0,y:0,index:0
      };
      this.textures.forEach((texture, index)=> {
        if((texture.frame.x === this.comaSymbolParams.x) && ( texture.frame.y === this.comaSymbolParams.y)) {
          params.width = texture.orig.width;
          params.x = texture.frame.x;
          params.y = texture.frame.y
          params.index = index
        }
      })
      return params
    },
    secondSymbol() {
      let params = {
        width:0,x:0,y:0,index:0
      };
      this.textures.forEach((texture, index)=> {
        if((texture.frame.x === this.secondSymbolParams.x) && ( texture.frame.y === this.secondSymbolParams.y)) {
          params.index = index
          params.x = texture.frame.x
          params.y = texture.frame.y
          params.width = texture.orig.width
        }
      })
      return params
    },
  },
  watch:{
    smallSymbolsXoffset: function () {
      console.log(this.smallSymbolsXoffset)
      if(this.app.stage) {
        this.clearStage()
        this.render(true)
      }
    },
    xoffset: function () {
      console.warn("xoffset change",this.xoffset)
      if(this.app.stage) {
        this.clearStage()
        this.render(false)
      }
    },
    shiftXSmall: function () {
      // console.log("shiftXSmall")
      // if(this.app.stage) {
      //   this.clearStage()
      //   this.render()
      // }
    },
  },
  methods: {
    drawPixi() {
      console.warn("drawPixi")
      let canvas = document.getElementById('pixi')
      this.app = new PIXI.Application({
        width: this.canvasWidths,
        height: this.canvasHeight,
        antialias: true,
        transparent: true,
        view: canvas,
      })
      this.app.renderer.backgroundColor = 0xffffff
      this.parse()
    },
    parse() {
      console.warn("parse")
      let atlas = JSON.parse(this.loadedJSON)
      let loader = this.app.loader;
      let png = this.loadedPNG
      loader.add(png).load(() => {
        const sheet = new PIXI.Spritesheet(
            loader.resources[png].texture.baseTexture, atlas
        );
        sheet.parse((...args) => {
          this.textures = Object.values(args[0])
          //console.warn(this.textures)
         this.textures.forEach((texture, index) => {
           console.warn(texture)
          })
          this.$emit("texturesIsReady", this.textures)
          this.render(false)
        });
      })
    },
    render(jsonHasSmallSymbols) {
      console.warn("render")
      this.showRenderButton = false
      this.addCanvasBorder();
      let firstSymbol = this.secondSymbol;
      this.addSymbol(0,0,firstSymbol.index, false)
      if(jsonHasSmallSymbols) {
        this.addSymbol(firstSymbol.width + this.smallSymbolsXoffset, 0, this.comaSymbol.index, false)
      }else{
        this.addSymbol(firstSymbol.width + this.xoffset, 0, this.secondSymbol.index, false)
      }
    },
    prepareForPreview() {
      let indexSecondSymbol = 5
      this.secondSymbolsParams={}
    },
    addCanvasBorder() {
      this.spritesheetWrapper = new PIXI.Container()
      this.spriteSheetBorder = new PIXI.Graphics();
      this.spriteSheetBorder.lineStyle(2, 0x000000, 1);
      this.spriteSheetBorder.drawRect(0, 0, this.canvasWidths, this.canvasHeight);
      this.spriteSheetBorder.endFill();
      this.spriteSheetBorder.x = 0;
      this.spriteSheetBorder.y = 0;
      this.spritesheetWrapper.addChild(this.spriteSheetBorder)
      this.app.stage.addChild(this.spritesheetWrapper);
    },
    addSymbol(x, y, index, border) {
      let texture = this.textures[index]
      let spriteContainer = new PIXI.Container()
      let symbolSprite = PIXI.Sprite.from(texture);
      spriteContainer.x = x
      spriteContainer.y = y
      spriteContainer.addChild(symbolSprite)
      this.spritesheetWrapper.addChild(spriteContainer)
    },
    clearStage() {
      console.log("clearStage")
      if(this.app && this.app.stage.children.length>0){
        while(this.app.stage.children[0]) {
          this.app.stage.removeChild(this.app.stage.children[0])
        }
      }
    },
  }
}
</script>