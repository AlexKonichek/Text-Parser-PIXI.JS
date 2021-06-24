<template lang="html">
  <main class="bg-secondary ">
    <div class="w-100 0">
      <div class="row">
        <div class="col-sm-4 mr-2">
          <div class="m-3">
            <label class="text-white h4 mt-2"  for="symbols">Required symbols</label>
            <div class="input-group input-group-lg m-3">
              <input
                  type="text"
                  id="symbols"
                  ref="inputSymbols"
                  class="form-control mr-3"
                  v-model="inputSymbols"
                  required
                  placeholder="paste your symbols in right order"
              >
              <div v-if="showError" class="alert alert-danger" role="alert">
                Not enough symbols  for parsing
              </div>
            </div>
            <label  class="label text-white h4" for="Select">Choose symbols set</label>
            <select  ref="select" class="form-control form-control-lg m-3" id="Select" v-model="inputSymbols">
              <option :value="this.selectOption1">{{ this.selectOption1 }}</option>
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
            <label class="text-white h4" for="XAdvance">XAdvance</label>
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
                    @load="JSONtext = $event"
                    @json="JSONFile = $event"
                    @image="image = $event"
          ></OpenFile>

          <PIXIRenderer
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
      <div v-if="showTextArea" class="row h-25 m-3">
        <div class="col-sm-4">
        </div>
        <div class="col-sm-4">
          <div class="form-group">
            <label class="h4 text-white" for="JSON">JSON</label>
            <textarea class="form-control" id="JSON" v-model="JSONtext" rows="10" cols="50"></textarea>

          </div>
        </div>
        <div  class="col-sm-4">
          <div class="form-group">
            <label class="h4 text-white" for="XML">XML</label>
            <textarea class="form-control" id="XML" v-model="XMLText" rows="10" cols="50"></textarea>
            <button class="btn btn-success btn-lg m-3"  v-on:click="this.createXML">Save XML</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>

import OpenFile from "./OpenFile";
import PIXIRenderer from "./PIXIREnderer";

export default {
  components: { PIXIRenderer, OpenFile},
  data () {
    return {
      comaOrDotExist:false,
      showLetterSpacing:false,
      checkedLetterSpasing: false,
      checkedSpriteBorder:false,
      charCodesAndNamesArr:[],
      charCodeArr:[],
      changeXAdvance:0,
      changeYAdvance:0,
      coordinatesArr: [],
      canvasSize:{},
      currentXAdvance:0,
      dotXAdvance:0,
      comaXAdvance:0,
      selectOption1:',.0123456789',
      selectOption2:",ABCDEFGHIJKLMNOPQRSTUVWX×YZ.",
      selectOption3:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      selectOption4:"abcdefghijklmnopqrstuvwxyz",
      scale:1,
      showError:false,
      showRenderButton:false,
      showBorderCheckbox:false,
      showLetterSpacingModeCheckbox:false,
      showShiftX:false,
      showTextArea:false,
      symbolsArr:[],
      sourceSizeW:0,
      sourceSizeH:0,
      readyToRender:false,
      framesArr: [],
      framesNames: [],
      framesWidths:[],
      framesHeights:[],
      t: 0,
      inputSymbols: ",.0123456789",
      maxWidth: 1,
      maxSymbolWidthFromJSON:0,
      maxSymbolWidth: undefined,
      maxWidthReady:false,
      maxDotWidth:0,
      font:'font family',
      JSONFile:{},
      JSONtext: '',
      image:{},
      XMLText:'',
      XMLFileName:'',
      xadvance:0,
      xoffset:0,
      yoffset:0,
      yadvance:0,

    }
  },

  watch: {
    image:function () {
      //this.showRenderButton = true
      this.submitHandler()
      this.maxSymbolWidthFromJSON = this.getMaxSymbolWidthFromJSON()
      this.showTextArea = true
    },

    changeXAdvance:function () {
      this.JSON2XML()
    },

    changeYAdvance:function () {
      this.JSON2XML()
    },

    maxSymbolWidth: function () {
      console.log('maxSymbolWidth')
      this.JSON2XML()
    },

    JSONtext:function () {
      let data = JSON.parse(this.JSONtext)
      let frames = Object.values(data)[0]
      this.canvasSize = Object.values(data)[1].size
      this.XMLFileName = Object.values(data)[1].image
      this.scale = Object.values(data)[1].scale
      this.font = Object.values(data)[1].image.split(".")[0]
      this.framesArr = Object.values(frames)
      this.framesArr.forEach(frame => {
        this.framesWidths.push(frame.sourceSize.w)
        this.framesHeights.push(frame.sourceSize.h)

      })
      this.framesNames = Object.keys(frames)
      this.maxWidthReady = true
      this.$refs.inputSymbols.focus()
    },

    charCodeArr:function () {
      this.charCodeArr.forEach((charCode,i) => {
        let charCodeAndName = {[charCode]:this.framesNames[i]}
        this.charCodesAndNamesArr.push(charCodeAndName)
      })
    },
  },

  computed:{
    maxSymbolHeightFromJSON(){
      return Math.max(...this.framesHeights)
    },

    maxSymbolWidthModel: {
      set(value) {
        this.maxSymbolWidth = value;
        //console.log(value, this.maxSymbolWidth);
      },

      get() {
        return this.maxSymbolWidth !== undefined? this.maxSymbolWidth : this.maxSymbolWidthFromJSON;
      }
    }

  },

  methods: {
    getMaxSymbolWidthFromJSON () {
      return Math.max(...this.framesWidths)
    },

    xAdvanceInputHandler(e){
      console.log('xAdvanceInputHandler')
      console.log(e.target.value)
      this.currentXAdvance = e.target.value
      console.log(this.currentXAdvance)
      this.JSON2XML()
    },

    refreshPage () {
      location.reload();
    },

    update (dt) {
      this.t += dt
    },

    submitHandler: function() {
      let ArrInputValues = this.inputSymbols.split("");
      ArrInputValues.forEach((item,i) => {
        this.symbolsArr.push(item);
        this.charCodeArr.push(item.charCodeAt(0));
        if(this.charCodeArr.includes(44) || this.charCodeArr.includes(46)) {
          this.comaOrDotExist = true
        }
      })

      //input validation
      if(ArrInputValues.length>0 && ArrInputValues.length !== this.symbolsArr.length){
        this.showError = true
      }
      else {
        this.readyToRender = true;
        this.showError = false
        this.showShiftX = true
        this.showRenderButton = false
        this.showBorderCheckbox = true
        this.showLetterSpacingModeCheckbox = true
      }

      this.JSON2XML();
      //this.getMaxSymbolWidthFromJSON()
    },

    createXML:function () {
      let xmltext = this.XMLText
      let name = this.XMLFileName.split('.')[0]
      let filename = `${name}.xml`;
      let pom = document.createElement('a');
      let bb = new Blob([xmltext], {type: 'text/plain'});
      pom.setAttribute('href', window.URL.createObjectURL(bb));
      pom.setAttribute('download', filename);
      pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
      pom.draggable = true;
      pom.classList.add('dragout');
      pom.click();
    },

    JSON2XML(){
      console.log("JSON2XML")
      let yoffset,
          xoffset
      this.XMLText = `

<font>

  <info face="${this.font}" size="${this.framesHeights[0]}" />
  <common lineHeight="${this.framesHeights[0]}" scaleW="494" scaleH="479" pages="1" />
  <pages>
    <page id="0" file="${this.font}.png" />
  </pages>
  <chars count="${this.framesArr.length}">\n`
      let comaAndDotWidthsArr = []
      this.framesArr.forEach(({frame,sourceSize}, index) => {
        //fill coordinates array for rendering
        let coordinates = {x:frame.x, y:frame.y}
        this.coordinatesArr.push(coordinates)

        if(this.symbolsArr[index]==="." || this.symbolsArr[index] === ',') {
          /*comaAndDotWidthsArr.push((sourceSize.w))
          this.maxDotWidth = Math.max(...comaAndDotWidthsArr)
          this.comaXAdvance = this.maxDotWidth + Number(this.changeXAdvance)
          this.dotXAdvance = this.maxDotWidth + Number(this.changeXAdvance)
          this.yadvance = frame.h + Number(this.changeYAdvance)*/
        }else{
          this.xadvance = Number(this.maxSymbolWidth || this.maxSymbolWidthFromJSON) + Number(this.changeXAdvance)
          this.yadvance = this.maxSymbolHeightFromJSON + Number(this.changeYAdvance)
        }



        yoffset = (this.yadvance-sourceSize.h)/2
        xoffset = (Number(this.xadvance)-sourceSize.w)/2
        let row =  `    <char id="${this.charCodeArr[index]}" x="${frame.x}" y="${frame.y}" width="${frame.w}" height="${frame.h}" xoffset="${xoffset}" yoffset="${yoffset}" xadvance="${this.xadvance}" /><!-- ${this.symbolsArr[index]} -->\n`
            this.XMLText += row
      })
      this.XMLText += `    <char id="32" x="0" y="0" width="0" height="0" xoffset="0" yoffset="0" xadvance="${this.xadvance}" /><!--   -->\n`
      this.XMLText += `    <char id="9" x="0" y="0" width="0" height="0" xoffset="0" yoffset="0" xadvance="${this.xadvance}" /><!--       -->\n`

      this.XMLText +=`  </chars>
        <kernings count="0">
        </kernings>
        </font>`
        console.log(this.xadvance,xoffset)
        }

  }
}

</script>

<style>
</style>

