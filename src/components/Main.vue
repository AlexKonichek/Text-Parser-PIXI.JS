<template lang="html">
  <main class="bg-secondary ">
    <div class="w-100 0">
      <div class="row">
        <div class="col-sm-3 mr-2">
          <div v-if="showSidePanel" class="m-3">
            <label class="text-white h4 mt-2"  for="symbols">Required symbols</label>
            <div class="input-group input-group-lg m-3">
              <input
                  type="text"
                  id="symbols"
                  ref="inputSymbols"
                  class="form-control mr-3"
                  v-model="inputSymbols"
                  v-on:input="RequiredSymbolsHandler"
                  required
                  placeholder="paste your symbols in right order"
              >
            </div>
            <div v-if="showInputError" class="alert alert-danger" role="alert">
              Not enough symbols for parsing
            </div>
            <label  class="label text-white h4" for="Select">Choose symbols set</label>
            <select  ref="select" class="form-control form-control-lg m-3" id="Select" v-model="inputSymbols" v-on:change="inputHandler" >
              <option  :value="this.selectOption1">{{ this.selectOption1 }}</option>
              <option>{{ this.selectOption2 }}</option>
              <option>{{ this.selectOption3 }}</option>
              <option>{{ this.selectOption4 }}</option>
            </select>
            <label class="text-white h4" for="font-family">Font family</label>
            <div class="input-group input-group-lg m-3">
              <input
                  type="text"
                  id="font-family"
                  ref="inputSymbols"
                  class="form-control mr-3"
                  v-model="font"
                  required
              >
            </div>
            <label class="text-white h4" for="XAdvance">General XAdvance</label>
            <div class="input-group input-group-lg m-3">
              <input
                  id="XAdvance"
                  class="form-control mr-3"
                  ref="XAdvance"
                  v-model="maxSymbolWidthModel"
                  step="1"
                  min="1"
                  type="number"
              >
            </div>
            <label class="text-white h4" for="XAdvanceSmall">Small symbol XAdvance</label>
            <div class="input-group input-group-lg m-3">
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

            <div v-if="checkedLetterSpasing">
              <label class="text-white h4" for="ChangeXAdvance">Change letter spacing</label>
              <div class="input-group input-group-lg m-3">
                <input
                    id="ChangeXAdvance"
                    class="form-control mr-3"
                    v-model="changeXAdvance"
                    step="1"
                    min="-100"
                    max="+100"
                    type="number"
                >
              </div>
            </div>
            <div v-if="checkedLetterSpasing">
              <label class="text-white h4" for="ChangeYAdvance">Change y position</label>
              <div class="input-group input-group-lg m-3">
                <input
                    id="ChangeYAdvance"
                    class="form-control mr-3"
                    v-model="changeYAdvance"
                    step="1"
                    min="-100"
                    max="+100"
                    type="number"
                >
              </div>
            </div>
            <div v-if="showLetterSpacingModeCheckbox" class="form-check form-switch m-3">
              <input class="form-check-input " v-model="checkedLetterSpasing" type="checkbox" id="ShowLetterSpasingMode">
              <label class="form-check-label text-white" for="ShowLetterSpasingMode">letter spacing mode</label>
            </div>
            <div v-if="showBorderCheckbox" class="form-check form-switch m-3">
              <input class="form-check-input" type="checkbox" v-model="checkedSpriteBorder"  id="ShowBorderCheck">
              <label class="form-check-label text-white" for="ShowBorderCheck">
                Show sprite border
              </label>
            </div>

            <button ref='refresh' class="btn btn-light m-3"  v-on:click="refreshPage">Clear</button>

          </div>
        </div>
        <div class="col-sm-9 bg-light ml-3">
          <OpenFile v-if="showOpenFile"
                    @json="loadedJSON = $event"
                    @image="loadedPNG = $event"

          ></OpenFile>
          <button v-if="showCreateXMLButton" class="btn btn-light m-3"  v-on:click="CreateXML">Create</button>
          <XML_Creator
              :allowToCreateXML="allowToCreateXML"
              :XMLText="XMLText"
              :JSONtext="loadedJSON"
              :inputSymbols="symbolsArr"
              :GeneralxAdvance="maxSymbolWidth"
          />

          <Renderer
              v-if="readyToRender"
              ref='PIXIRenderer'
              :render="readyToRender"
              :changeXAdvance="changeXAdvance"
              :changeYAdvance="changeYAdvance"
              :charCodeArr="charCodeArr"
              :letterSpasing="checkedLetterSpasing"
              :json="loadedJSON"
              :image="loadedPNG"
              :scale="scale"
              :coordinatesArr="coordinatesArr"
              :canvasSize="canvasSize"
              :showBorderCheckbox="checkedSpriteBorder"
              :frameW="framesWidths"
              :frameH="framesHeights"
          />
        </div>
      </div>
      <div class="row"></div>
    </div>
  </main>
</template>
<script>

import OpenFile from "./OpenFile";
import Renderer from "./Renderer";
import XML_Creator from "@/components/XML-Creator";

export default {
  components: {Renderer, OpenFile, XML_Creator},
  data() {
    return {
      arrSmallSymbolsWidth:[],
      allowToCreateXML: false,
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
      selectOption1: '0123456789,.×',
      selectOption2: ",ABCDEFGHIJKLMNOPQRSTUVWX×YZ.",
      selectOption3: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      selectOption4: "abcdefghijklmnopqrstuvwxyz",
      showModal:false,
      showCreateXMLButton:false,
      showImagePreview:false,
      showOpenFile:true,
      showSidePanel:false,
      showInputError: false,
      showRenderButton: false,
      showBorderCheckbox: false,
      showLetterSpacingModeCheckbox: false,
      showShiftX: false,
      showTextArea: false,
      symbolsArr: [],
      sourceSizeW: 0,
      sourceSizeH: 0,
      readyToRender: false,
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
      JSONFile: {},
      loadedJSON: '',
      loadedPNG: {},
      XMLText: '',
      XMLFileName: '',
      xadvance: 0,
      xoffset: 0,
      yoffset: 0,
      yadvance: 0,
    }
  },
  watch: {
    loadedJSON: function () {
      debugger
      this.preparseJSON()
      this.showOpenFile = false
      this.showMessage()
      this.showSidePanel = true
      //this.allowToCreateXML = true
      this.showImagePreview = true
    },
    inputSymbols: function () {
      console.warn("change inputSymbols")
    },
    changeXAdvance: function () {
      //this.JSON2XML()
    },

    changeYAdvance: function () {
      //this.JSON2XML()
    },
    maxSymbolWidth: function () {

    },
    maxSmallSymbolWidth: function () {
      //this.JSON2XML()
    },

    charCodeArr: function () {
      this.charCodeArr.forEach((charCode, i) => {
        let charCodeAndName = {[charCode]: this.framesNames[i]}
        this.charCodesAndNamesArr.push(charCodeAndName)
      })
    },
  },
  computed: {
    // maxSymbolHeightFromJSON() {
    //   return Math.max(...this.framesHeights)
    // },

    maxSymbolWidthModel: {
      set(value) {
        this.maxSymbolWidth = value;
      },
      get() {
        return this.maxSymbolWidth !== undefined ? this.maxSymbolWidth : this.maxSymbolWidthFromJSON;
      }
    },
    maxSmallSymbolWidthModel: {
      set(value) {
        this.maxSmallSymbolWidth = value;
        //console.log(value, this.maxSmallSymbolWidth);
      },

      get() {
        return this.maxSmallSymbolWidth !== undefined ? this.maxSmallSymbolWidth : this.maxSmallSymbolWidthFromJSON;
      }
    }

  },
  methods: {
      CreateXML () {
        this.allowToCreateXML = true
      },
      showMessage() {
        this.showModal = true
        //this.preparseJSON()

      },
      preparseJSON() {
        console.warn("preparseJSON");
        debugger
        let data = JSON.parse(this.loadedJSON)
        let frames = Object.values(data)[0]
        this.framesArr = Object.values(frames)
        let inputSymbolsArr = this.inputSymbols.split("");
        this.framesArr.forEach((frame, index) => {
          if (inputSymbolsArr[index] === "." || inputSymbolsArr[index] === "," || inputSymbolsArr[index] === "×") {
            this.arrSmallSymbolsWidth.push(inputSymbolsArr[index])
            this.maxSmallSymbolWidth = Math.max(...this.arrSmallSymbolsWidth)
          }
          this.framesWidths.push(frame.sourceSize.w)
        })

        this.maxSymbolWidthFromJSON = Math.max(...this.framesWidths)
        console.log(this.maxSymbolWidthFromJSON);
      },

      RequiredSymbolsHandler(e) {

        console.log("RequiredSymbolsHandler", e.target.value)

        let symbols = e.target.value
        this.symbolsArr =symbols.split("");
         if(this.symbolsArr.length === this.framesArr.length && this.framesArr.length) {
           this.showInputError = false
           this.showCreateXMLButton = true
         }else {
           this.showInputError = true
         }

        //this.updateData()
        //this.prepareToRender()
      },
      inputHandler() {
        console.log("inputHandler: choose symbols set is touched")
        this.updateData()
        this.prepareToRender()
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
        console.log('xAdvanceInputHandler')
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