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
                    ref="inputSymbols"
                    class="form-control mr-3"
                    v-model="inputSymbols"
                    v-on:change="RequiredSymbolsHandler"
                    required
                    placeholder="paste your symbols in right order"
                >
              </div>
            </div>
            <div v-if="showInputError" class="alert alert-danger" role="alert">
             <p> <b>Not enough symbols for parsing!</b></p>
              <p>Should be {{this.framesArr.length}}</p>

            </div>
           <div v-if="showForm">
             <label  class="label text-white h4" for="Select">Choose symbols set</label>
             <select  ref="select" class="form-control form-control-lg mb-2" id="Select" v-model="inputSymbols" v-on:change="chooseSymbolsHandler" >
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
            <div v-if="jsonHasSmallSymbos">
              <label class="text-white h4" for="XAdvanceSmall">xadvance for "." "," and "×"</label>
              <div class="input-group input-group-lg mb-2">
                <input
                    id="XAdvanceSmall"
                    class="form-control mr-3"
                    ref="XAdvance"
                    v-model="maxSmallSymbolWidthModel"
                    step="1"
                    min="1"
                    type="number"
                >
              </div>
            </div>
            <Renderer
                v-if="showRenderer"
                @textures="passTexture"
                :canvasHeight="maxSymbolHeightModel"
                :loadedJSON="loadedJSON"
                :loadedPNG="loadedPNG"
                :showRenderer="showRenderer"
                :xoffset="xoffset"
                :finalSmallXAdvance="finalSmallXAdvance"
                :jsonHasSmallSymbos="jsonHasSmallSymbos"
                :comaSymbolParams="comaParams"
                :dotIndex="dotIndex"
                :symbolWidth="xadvance"
                :secondSymbolParams="secondSymbolParams"
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
          <div id="previewImage">
          <img v-if="showImagePreview" :src="imgUrl" width="500"  />
        </div>

          <div v-if="showFrameNamesOrderMessage" class="">
            <h2>Please, put symbols in right order or select it from selector under symbols form</h2>
          </div>
          <button v-if="showCreateXMLButton" class="btn btn-secondary m-4"  v-on:click="CreateXML">Create</button>
          <XML_Creator v-if="isDataReady"
                       @xOffsetChange="xoffset = $event"
                       :finalSmallXAdvance="finalSmallXAdvance"
                       :allowToCreateXML="allowToCreateXML"
                       :JSONtext="loadedJSON"
                       :symbolsArr="symbolsArr"
                       :finalXAdvance="finalXAdvance"
                       :smallSymbolsXadvance="maxSmallSymbolWidth"
                       :arrSymbolsWidths="arrSymbolsWidths"
                       :arrSmallSymbolsWidth="arrSmallSymbolsWidth"
                       :symbolWidth="xadvance"
                       :textures="textures"
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
      secondSymbolParams:{
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
      jsonHasSmallSymbos:false,
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
      dotIndex:0
    }
  },
  watch: {
    loadedJSON: function () {
      this.showOpenFile = false
      this.createShowFrameNameOrderList()
      this.showImagePreview = true
      this.showSidePanel = true
      console.log(this.imgUrl)


      //this.allowToCreateXML = true

    },
    loadedPNG: function () {
      this.showImagePreview = true
    },
    inputSymbols: function () {
      this.symbolsArr = []
      this.symbolsArr = this.inputSymbols.split("");
      console.log("inputSymbols is changed", this.symbolsArr)
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
    passTexture(e){
      this.textures = e
    },
    createShowFrameNameOrderList() {
      let data = JSON.parse(this.loadedJSON)
      let frames = Object.values(data)[0]
      this.frameNamesArr = Object.keys(frames).map((name, index) =>name.split(".")[0])
      console.log(this.frameNamesArr)
      this.showFrameNamesOrderMessage = true

    },

    isAllReady() {
      console.log("checking if all data ready")
      if(this.maxSymbolWidth===undefined) {
        this.finalXAdvance = this.xadvance
      } else {
        this.finalXAdvance = this.maxSymbolWidth
      }
      if(this.maxSmallSymbolWidth===undefined) {
        this.finalSmallXAdvance = this.xadvanceSmall
      } else {
        this.finalSmallXAdvance = this.maxSmallSymbolWidth
      }


      if(this.finalXAdvance>0 && this.loadedJSON && this.symbolsArr.length>0 && this.arrSymbolsWidths.length>0){
        this.isDataReady = true
        this.showCreateXMLButton = true
        console.warn("data is ready")
      }else {
          throw new Error("data is not ready")
      }

    },
    CreateXML() {
      this.allowToCreateXML = true
      this.showCreateXMLButton = false
      this.showImagePreview = false
      this.showForm =false
      this.showRenderer = true
      this.showFrameNamesOrderMessage = false
      if(this.arrSmallSymbolsWidth.length===0){
        this.showXadvanceForSmallSymbols = false
      }
    },


    preparseJSON() {
      console.warn("preparseJSON");
      this.arrSmallSymbolsWidth = []
      this.arrSymbolsWidths = []
      if(this.symbolsArr.includes("S")) {
        this.secondSymbolParams.symbol = 'S'
      }
      else {
        this.secondSymbolParams.symbol = "0"
      }
      this.framesArr.forEach((frame, index) => {
        switch (this.symbolsArr[index]) {
          case ".": this.arrSmallSymbolsWidth.push(frame.sourceSize.w)
                    this.jsonHasSmallSymbos = true
                    this.dotIndex = index
            break;
          case ",": this.arrSmallSymbolsWidth.push(frame.sourceSize.w)
                    this.jsonHasSmallSymbos = true
                    this.comaParams = {width:frame.sourceSize.w, height:frame.sourceSize.h, x:frame.frame.x, y:frame.frame.y}

            break;
          case "×": this.arrSmallSymbolsWidth.push(frame.sourceSize.w)
                    this.jsonHasSmallSymbos = true
            break;
          case this.secondSymbolParams.symbol: this.secondSymbolParams.width = frame.sourceSize.w
                    this.secondSymbolParams.x = frame.frame.x
                    this.secondSymbolParams.y = frame.frame.y
            break;

          default:this.arrSymbolsWidths.push(frame.sourceSize.w);
                  this.arrSymbolsHeights.push(frame.sourceSize.h)

            break;

        }
      })
      this.isAllReady()
    },

    RequiredSymbolsHandler(e) {

      console.log("RequiredSymbolsHandler", e.target.value)
      this.inputSymbols = e.target.value
      //let symbols = e.target.value
      this.symbolsArr = this.inputSymbols.split("");
      let data = JSON.parse(this.loadedJSON)
      let frames = Object.values(data)[0]
      this.framesArr = Object.values(frames)

      //input symbols verification
      this.validateSymbolsForm()
    },
    chooseSymbolsHandler(e) {
      console.log("chooseSymbolsHandler", e.target.value)
      this.RequiredSymbolsHandler(e)
      this.validateSymbolsForm()


      //this.updateData()
      //this.prepareToRender()
    },

    validateSymbolsForm() {
      if(this.symbolsArr.length === this.framesArr.length) {
        this.showInputError = false
        this.preparseJSON()

      }else {
        this.showInputError = true
        this.showCreateXMLButton = false
      }
    },


    updateData()
    {
      this.comaAndDotWidthsArr = [],
          this.coordinatesArr = [],
          this.charCodeArr = [],
          this.charCodesAndNamesArr = [],
          this.symbolsArr = []
    },
    xAdvanceInputHandler(e)
    {
    //  console.log('xAdvanceInputHandler')
      this.currentXAdvance = e.target.value
      //this.JSON2XML()
    }
    ,

    refreshPage()
    {
      location.reload();
    }
    ,
    prepareToRender: function () {
      //this.JSON2XML();

    }
  }
}
</script>
<style>
  ul {
    list-style: none;
  }
</style>
