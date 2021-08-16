<template lang="html">
  <main class="bg-secondary ">
    <div class="w-100 0">
      <div class="row">
        <div class="col-sm-4 mr-2">
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
              Not enough symbols  for parsing
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
        <div class="col-sm-8 bg-light ml-3">
          <OpenFile v-if="!readyToRender"
                    @json="JSONtext = $event"
                    @image="image = $event"
          ></OpenFile>

          <Renderer
              v-if="readyToRender"
              ref='PIXIRenderer'
              :render="readyToRender"
              :changeXAdvance="changeXAdvance"
              :changeYAdvance="changeYAdvance"
              :charCodeArr="charCodeArr"
              :letterSpasing="checkedLetterSpasing"
              :json="JSONtext"
              :image="image"
              :scale="scale"
              :coordinatesArr="coordinatesArr"
              :canvasSize="canvasSize"
              :showBorderCheckbox="checkedSpriteBorder"
              :frameW="framesWidths"
              :frameH="framesHeights"
          />
        </div>
      </div>
      <div class="row">
        <XML_Creator
            :allowToCreateXML="allowToCreateXML"
            :XMLText="XMLText"
            :XMLFileName="XMLFileName"
            :JSONtext="JSONtext"
            :inputSymbols="symbolsArr"
        />
      </div>
    </div>
  </main>
</template>
<script>

import OpenFile from "./OpenFile";
import Renderer from "./Renderer";
import XML_Creator from "@/components/XML_Creator";

export default {
  components: {Renderer, OpenFile, XML_Creator},
  data() {
    return {
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
      selectOption1: ',.0123456789',
      selectOption2: ",ABCDEFGHIJKLMNOPQRSTUVWX×YZ.",
      selectOption3: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      selectOption4: "abcdefghijklmnopqrstuvwxyz",
      showImagePreview:false,
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
      framesNames: [],
      inputSymbols: ",.0123456789",
      maxWidth: 1,
      maxSymbolWidthFromJSON: 0,
      maxSmallSymbolWidthFromJSON: 0,
      maxSymbolWidth: undefined,
      maxSmallSymbolWidth: undefined,
      maxWidthReady: false,
      framesArr:[],
      JSONFile: {},
      JSONtext: '',
      image: {},
      XMLText: '',
      XMLFileName: '',
      xadvance: 0,
      xoffset: 0,
      yoffset: 0,
      yadvance: 0,

    }
  },
  watch: {
    JSONtext: function () {
      this.preparseJSON()
      this.showSidePanel = true
      this.showImagePreview = true
    },
    changeXAdvance: function () {
      this.JSON2XML()
    },

    changeYAdvance: function () {
      this.JSON2XML()
    },
    maxSymbolWidth: function () {
      this.JSON2XML()
    },
    maxSmallSymbolWidth: function () {
      this.JSON2XML()
    },

    charCodeArr: function () {
      this.charCodeArr.forEach((charCode, i) => {
        let charCodeAndName = {[charCode]: this.framesNames[i]}
        this.charCodesAndNamesArr.push(charCodeAndName)
      })
    },
  },
  computed: {
    maxSymbolHeightFromJSON() {
      return Math.max(...this.framesHeights)
    },

    maxSymbolWidthModel: {
      set(value) {
        this.maxSymbolWidth = value;
        //console.log(value, this.maxSymbolWidth);
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
      preparseJSON() {
        let data = JSON.parse(this.JSONtext)
        let frames = Object.values(data)[0]
        this.framesArr = Object.values(frames)
      },

      RequiredSymbolsHandler(e) {
        //console.log("RequiredSymbolsHandler", e.target.value)
        let symbols = e.target.value
        this.symbolsArr =symbols.split("");
        console.log(this.symbolsArr.length, this.framesArr.length )
         if(this.symbolsArr.length === this.framesArr.length) {
           this.showInputError = false
           this.allowToCreateXML = true
         }else {
           this.showInputError = true
         }

        //this.updateData()
        //this.prepareToRender()
      }
    ,
      inputHandler()
      {
        console.log("inputHandler")
        this.updateData()
        this.prepareToRender()

      }
    ,
      updateData()
      {
        this.comaAndDotWidthsArr = [],
            this.coordinatesArr = [],
            this.charCodeArr = [],
            this.charCodesAndNamesArr = [],
            this.symbolsArr = []
      }
    ,



      xAdvanceInputHandler(e)
      {
        console.log('xAdvanceInputHandler')
        this.currentXAdvance = e.target.value
        this.JSON2XML()
      }
    ,

      refreshPage()
      {
        location.reload();
      }
    ,
      prepareToRender: function () {
        this.JSON2XML();

      }
    }
    }

</script>


