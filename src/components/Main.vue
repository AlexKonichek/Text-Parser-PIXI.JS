<template lang="html">
  <main class="bg-secondary">
    <div class="w-100 0">
      <div class="row">
        <div class="col-sm-3 mr-2">
          <div v-if="showSidePanel" class="m-3">
            <div>
              <label class="text-white h4 mt-2"  for="symbols">Required symbols</label>
              <div class="input-group input-group-lg mb-2">
                <input
                    type="text"
                    id="symbols"
                    
                    class="form-control mr-3"
                    v-model="inputSymbols"
                    required
                    placeholder="paste your symbols"
                >
              </div>
            </div>
            <div v-if="showInputError" class="alert alert-danger" role="alert">
             <p> <b>Not enough symbols for parsing!</b></p>
              <p>Should be {{this.framesArr.length}}</p>

            </div>
           <div v-if="showForm">
             <label  class="label text-white h4" for="Select">Choose symbols set</label>
             <select class="form-control form-control-lg mb-2" id="Select" v-model="inputSymbols" v-on:change="chooseSymbolsHandler" >
               <option  :value="this.selectOption1">{{ this.selectOption1 }}</option>
               <option>{{ this.selectOption2 }}</option>
             </select>
           </div>
<!--            <label class="text-white h4" for="font-family">Font family</label>-->
<!--            <div class="input-group input-group-lg m-3">-->
<!--              <input-->
<!--                  type="text"-->
<!--                  id="font-family"-->
<!--                  ref="inputSymbols"-->
<!--                  class="form-control mr-3"-->
<!--                  v-model="font"-->
<!--                  required-->
<!--              >-->
<!--            </div>-->
            <label class="text-white h4" for="XAdvance">general xadvance</label>
            <div class="input-group input-group-lg mb-2">
              <input
                  id="XAdvance"
                  class="form-control mr-3"
                  ref="XAdvance"
                  v-model="maxSymbolWidthModel"
                  step="1"
                  type="number"
              >
            </div>
            <div v-if="jsonHasSmallSymbols">
              <label class="text-white h4" for="XAdvanceSmall">xadvance for "." "," and "×"</label>
              <div class="input-group input-group-lg mb-2">
                <input
                    id="XAdvanceSmall"
                    class="form-control mr-3"
                    ref="XAdvance"
                    v-model="maxSmallSymbolWidthModel"
                    step="1"
                    type="number"
                >
              </div>
            </div>
            <div v-if="showRenderer">
              <input type="checkbox" id="checkbox" v-model="showBorder">
              <label for="checkbox">Show border</label>
            </div>
            <Renderer
                v-if="showRenderer"
                @texturesIsReady="textures = $event"
                :canvasHeight="maxSymbolHeightModel"
                :loadedJSON="loadedJSON"
                :loadedPNG="loadedPNG"
                :showRenderer="showRenderer"
                :xoffset="xoffset"
                :finalSmallXAdvance="finalSmallXAdvance"
                :jsonHasSmallSymbols="jsonHasSmallSymbols"
                :comaSymbolParams="comaParams"
                :dotIndex="dotIndex"
                :symbolWidth="xadvance"
                :secondSymbolParams="symbolParamsForCorrectingXOffset"
                :symbolForCorrectingXOffset="symbolForCorrectingXOffset"
                :showBorder="showBorder"
            />

            <button ref='refresh' class="btn btn-light m-3"  v-on:click="refreshPage">Clear</button>

          </div>
        </div>
        <div class="col-sm-9 bg-light ml-3">

          <OpenFile v-if="showOpenFile"
                    @json="loadedJSON = $event"
                    @image="loadedPNG = $event"
                    @getImgUrl="imgUrl = $event"
          ></OpenFile>

          <div v-if="showFrameNamesOrderMessage">
            <h2><b>Please, put symbols in right order or select it from selector under symbols form</b></h2>
          </div>

          <div id="previewImage">
            <img v-if="showImagePreview" :src="imgUrl" width="500"  />
          </div>

          <button v-if="showCreateXMLButton" class="btn btn-secondary m-4"  v-on:click="CreateXML">Create XML</button>
          
          <XML_Creator v-if="isDataReady"
                       ref='xml' 
                       @xOffsetForRendererChange="xoffset = $event"
                       @symbolParamsIsReady="symbolParams = $event"
                       :dataReady="isDataReady"
                       :symbolsMap="symbolsMap"
                       :finalSmallXAdvance="finalSmallXAdvance"
                       :JSONtext="loadedJSON"
                       :symbolsArr="symbolsArr"
                       :finalXAdvance="finalXAdvance"
                       :smallSymbolsXadvance="maxSmallSymbolWidth"
                       :arrSymbolsWidths="arrSymbolsWidths"
                       :arrSmallSymbolsWidth="arrSmallSymbolsWidth"
                       :symbolWidth="xadvance"
                       :textures="textures"
                       :symbolForCorrectingXOffset="symbolForCorrectingXOffset"
          />


        </div>
      </div>
    </div>
  </main>
</template>
<script>

import OpenFile from "./OpenFile";
import Renderer from "./Renderer";
import XML_Creator from "./XML-Creator";

export default {
  components: {Renderer, OpenFile, XML_Creator},
  data() {
    return {
      arrSmallSumbolIndexesForRenderer:[],
      symbolParamsForCorrectingXOffset:{
        symbol:"S",
        width:0,
        x:0,
        y:0
      },
      textures:[],
      maxSymbolHeight:null,
      frameNamesArr: [],
      isDataReady:false,
      inputSymbolsArr:[],
      arrSymbolsWidths: [],
      arrSymbolsHeights:[],
      xAdvance:null,
      arrSmallSymbolsWidth:[],
      allowToCreateXML: false,
      finalSmallXAdvance: null,
      finalXAdvance:null,
      font: 'font family',
      comaOrDotExist: false,
      showLetterSpacing: false,
      checkedLetterSpasing: false,
      checkedSpriteBorder: false,
      charCodesAndNamesArr: [],
      charCodeArr: [],
      changeXAdvance: 0,
      changeYAdvance: 0,
      coordinatesArr: [],
      comaAndDotWidthsArr: [],
      currentXAdvance: 0,
      dotXAdvance: 0,
      comaXAdvance: 0,
      selectOption1: '.,×0123456789',
      selectOption2: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      showForm:true,
      showBorder:false,
      showModal:false,
      showCreateXMLButton:false,
      showXadvanceForSmallSymbols:false,
      showImagePreview:false,
      showOpenFile:true,
      showSidePanel:false,
      showInputError: false,
      showRenderButton: false,
      showBorderCheckbox: false,
      showLetterSpacingModeCheckbox: false,
      showShiftX: false,
      showTextArea: false,
      showFrameNamesOrderMessage:false,
      symbolsArr: [],
      symbolParams:[],
      symbolsMap:[],
      sourceSizeW: 0,
      sourceSizeH: 0,
      showRenderer: false,
      framesWidths: [],
      framesNames: [],
      //inputSymbols: ",.0123456789×",
      inputSymbols: "",
      maxWidth: 1,
      maxSymbolWidthFromJSON: 0,
      maxSmallSymbolWidthFromJSON: 0,
      maxSymbolWidth: undefined,
      maxSmallSymbolWidth: undefined,
      maxWidthReady: false,
      framesArr:[],
      jsonHasSmallSymbols:false,
      JSONFile: {},
      loadedJSON: '',
      loadedPNG: {},
      XMLText: '',
      XMLFileName: '',
      xoffset: 0,
      yoffset: 0,
      yadvance: 0,
      imgUrl:null,
      comaParams: {},
      dotIndex:0,
      symbolForCorrectingXOffset:"S",
      symbolForCorrectingXOffsetDefault:"0"
    }
  },
  watch: {
    textures: function () {
      this.createSymbolsMap()
    },
    symbolParams: function () {
      this.createSymbolsMap()
    },
    loadedJSON: function () {
      this.showOpenFile = false
      this.createShowFrameNameOrderList()
      this.showImagePreview = true
      this.showSidePanel = true

    },
    loadedPNG: function () {
      this.showImagePreview = true
    },
    inputSymbols: function () {
      this.symbolsArr = []
      this.symbolsArr = this.inputSymbols.split("");
      console.warn("inputSymbols is changed", this.symbolsArr)
      this.initialParse()
      this.validateSymbolsForm()
    },

    maxSymbolWidth: function () {
      this.finalXAdvance = Number(this.maxSymbolWidth)

    },
    maxSmallSymbolWidth: function () {
      this.finalSmallXAdvance = Number(this.maxSmallSymbolWidth)
    },

    charCodeArr: function () {
      this.charCodeArr.forEach((charCode, i) => {
        let charCodeAndName = {[charCode]: this.framesNames[i]}
        this.charCodesAndNamesArr.push(charCodeAndName)
      })
    },

  },
  computed: {
    xadvance() {
      return Math.max(...this.arrSymbolsWidths)
    },

   xadvanceSmall() {
      return Math.max(...this.arrSmallSymbolsWidth)
    },

    maxSmallSymbolWidthModel: {
      set(value) {
        this.maxSmallSymbolWidth = value;
      },
      get() {
        return this.maxSmallSymbolWidth !== undefined ? this.maxSmallSymbolWidth : this.xadvanceSmall
      }
    },
    maxSymbolWidthModel: {
      set(value) {
        this.maxSymbolWidth = value;
      },
      get() {
        return this.maxSymbolWidth !== undefined ? this.maxSymbolWidth : this.xadvance;
      }
    },
    maxSymbolHeightModel: {
      set(value) {
        this.maxSymbolHeight = value;
      },
      get() {
        return Math.max(...this.arrSymbolsHeights)
      }
    }

  },
  methods: {
     initialParse() {
       if(this.loadedJSON) {
         let data = JSON.parse(this.loadedJSON)
         let frames = Object.values(data)[0]
         this.framesArr = Object.values(frames)
       }else{
         throw new Error("JSON not loaded")
       }
       
     },
     createSymbolsMap(){
       console.warn("createSymbolsMap",this.symbolParams, this.textures)
       if((this.symbolParams.length>0) && (this.textures.length > 0)){
         console.warn(this.symbolParams.length, this.textures.length)
        let symbolsMap = new Map();
        this.symbolParams.forEach(symbol=> {
          this.textures.forEach(texture => {
            if((symbol.x === texture.frame.x) && (symbol.y === texture.frame.y)){
                console.log(symbol.height)
                let params = {
                  name:symbol.name,
                  texture:texture,
                  xoffset:symbol.xoffset,
                  width:symbol.width,
                  height:symbol.height
                }
                symbolsMap.set(symbol.name, params)
            }
          })
        })
         this.symbolsMap = symbolsMap

       }else{
         console.warn("data is not ready",this.symbolParams, this.textures )
       }
      
        
    },
    
    createShowFrameNameOrderList() {
      this.showFrameNamesOrderMessage = true

    },

   
    CreateXML() {
      this.isDataReady = true
      this.showRenderer = true
      this.showCreateXMLButton = false
      this.showImagePreview = false
      this.showForm =false
      this.showFrameNamesOrderMessage = false
      if(this.arrSmallSymbolsWidth.length===0){
        this.showXadvanceForSmallSymbols = false
      }
      
    },
    parseJSON() {
      console.warn("preparseJSON");
      this.arrSmallSymbolsWidth = []
      this.arrSymbolsWidths = []
      if(!this.symbolsArr.includes(this.symbolForCorrectingXOffset)) {
        this.symbolForCorrectingXOffset = this.symbolForCorrectingXOffsetDefault

      }
      console.warn(this.symbolForCorrectingXOffset);
      this.framesArr.forEach((frame, index) => {
        switch (this.symbolsArr[index]) {
          case ".":
                    this.arrSmallSymbolsWidth.push(frame.sourceSize.w)
                    this.jsonHasSmallSymbols = true
                    this.dotIndex = index
            break;
          case ",": 
                    this.arrSmallSymbolsWidth.push(frame.sourceSize.w)
                    this.jsonHasSmallSymbols = true
                    this.comaParams = {width:frame.sourceSize.w, height:frame.sourceSize.h, x:frame.frame.x, y:frame.frame.y}

            break;
          case "×": 
                    this.arrSmallSymbolsWidth.push(frame.sourceSize.w)
                    this.jsonHasSmallSymbols = true
            break;
          case this.symbolForCorrectingXOffset:
            this.symbolParamsForCorrectingXOffset.symbol = this.symbolForCorrectingXOffset
                    this.symbolParamsForCorrectingXOffset.width = frame.frame.w
                    this.symbolParamsForCorrectingXOffset.x = frame.frame.x
                    this.symbolParamsForCorrectingXOffset.y = frame.frame.y
                    console.warn(this.symbolParamsForCorrectingXOffset)
            break;

          default:this.arrSymbolsWidths.push(frame.frame.w);
                  this.arrSymbolsHeights.push(frame.frame.h)
                  console.log( this.arrSymbolsHeights)

            break;

        }
      })
      this.isAllReady()
    },

    
    chooseSymbolsHandler(e) {
    },
    validateSymbolsForm() {
          if(this.symbolsArr.length === this.framesArr.length) {
              this.showInputError = false
              this.parseJSON()

          }else {
            this.showInputError = true
            this.showCreateXMLButton = false
          }
    },
     isAllReady() {
      console.warn("isAllReady")
      if(this.maxSymbolWidth===undefined) { this.finalXAdvance = this.xadvance } 
      else { this.finalXAdvance = this.maxSymbolWidth }
      if(this.maxSmallSymbolWidth===undefined) { this.finalSmallXAdvance = this.xadvanceSmall } 
      else { this.finalSmallXAdvance = this.maxSmallSymbolWidth }

      if(this.finalXAdvance>0 && this.loadedJSON && this.symbolsArr.length>0 && this.arrSymbolsWidths.length>0){
        this.showCreateXMLButton = true
        console.warn("data is ready")
      }else {
          throw new Error("data is not ready")
      }

    },
    refreshPage(){location.reload()}
  
  }
}
</script>
<style>
  ul {
    list-style: none;
  }
</style>
