<template lang="html">
  <main class="bg-secondary ">
    <div class="w-100 0">
      <div class="row mb-3 ">
         <div class="col-sm-4">
           <label class="text-white h4" text-white for="symbols">Required symbols</label>
           <div class="input-group input-group-lg mb-3">
             <input
                type="text"
                id="symbols"
                ref="inputSymbols"
                class="form-control"
                v-model="inputSymbols"
                required
                placeholder="paste your symbols in right order"
             >
             <div v-if="showError" class="alert alert-danger" role="alert">
               Not enough symbols  for parsing
             </div>
           </div>

           <label  class="label text-white h4" for="Select">Choose symbols set</label>
           <select  ref="select" class="form-control form-control-lg mb-3" id="Select" v-model="inputSymbols">
            <option :value="this.selectOption1">{{ this.selectOption1 }}</option>
            <option>{{ this.selectOption2 }}</option>
            <option>{{ this.selectOption3 }}</option>
          </select>

          <label class="text-white h4" for="font-family">Font family</label>
           <div class="input-group input-group-lg mb-3">
             <input
                type="text"
                id="font-family"
                ref="inputSymbols"
                class="form-control"
                v-model="font"
                required
             >
           </div>

           <label class="text-white h4" for="Scale">Scale</label>
           <div class="input-group input-group-lg mb-3">
             <input
                id="Scale"
                class="form-control"
                v-model="scale"
                step="0.1"
                min="0.1"
                max="2"
                type="number"
             >
           </div>

           <button  ref='submit' class="btn btn-success mb-3" disabled v-on:click="submitHandler">Render</button>
        </div>
        <div class="col-sm-8 bg-light">
          <OpenFile v-if="!readyToRender"
                    @load="JSONtext = $event"
                    @json="JSONFile = $event"
                    @image="image = $event"
          ></OpenFile>

          <PIXIRenderer v-if="readyToRender"
              v-bind:render="readyToRender"
              ref='PIXIRenderer'
              :charCodeArr="charCodeArr"
              v-bind:json="JSONtext"
              v-bind:image="image"
              v-bind:maxWidth="this.getMaxSymbolWidthFromJSON()"
              v-bind:scale="scale"
              v-bind:coordinatesArr="coordinatesArr"
              v-bind:canvasSize="canvasSize"
          />
        </div>

      </div>
      <div class="row h-25">
        <div class="col-sm-4">

        </div>
        <div class="col-sm-4">
          <div class="form-group">
            <label for="JSON">JSON</label>
            <textarea class="form-control" id="JSON" v-model="JSONtext" rows="10" cols="50"></textarea>

          </div>
        </div>
        <div class="col-sm-4">
          <div class="form-group">
            <label for="XML">XML</label>
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
      selectOption1:',.0123456789',
      selectOption2:",ABCDEFGHIJKLMNOPQRSTUVWX×YZ.",
      selectOption3:"abcdefghijklmnopqrstuvwxyz",
      canvasSize:{},
      scale:1,
      showError:false,
      maxWidthReady:false,
      readyToRender:false,
      charCodesAndNamesArr:[],
      framesArr: [],
      framesNames: [],
      framesWidths:[],
      framesHeights:[],
      t: 0,
      inputSymbols: ",.0123456789",
      maxWidth: 1,
      font:'font family',
      JSONFile:{},
      JSONtext: '',
      image:{},
      XMLText:'',
      XMLFileName:'',
      charCodeArr:[],
      symbolsArr:[],
      coordinatesArr: [],
    }
  },
  watch: {
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
      this.$refs.submit.disabled = false
      this.$refs.inputSymbols.focus()
    },
    charCodeArr:function () {
      this.charCodeArr.forEach((charCode,i) => {
          let charCodeAndName = {[charCode]:this.framesNames[i]}
          this.charCodesAndNamesArr.push(charCodeAndName)
          })
    },
  },
  methods: {
    update (dt) {
      this.t += dt
    },
    getMaxSymbolWidthFromJSON() {
      return Math.max(...this.framesWidths)
    },
    getMaxSymbolHeightFromJSON() {
      return Math.max(...this.framesHeights)
    },
    submitHandler: function() {
      let ArrInputValues = this.inputSymbols.split("");
      ArrInputValues.forEach(item => {
        this.symbolsArr.push(item);
        this.charCodeArr.push(item.charCodeAt(0));

      })
      //input validation
        if(ArrInputValues.length>0 && ArrInputValues.length !== this.symbolsArr.length){
          this.showError = true
        }
        else {
          this.readyToRender=true;
          this.showError=false
        }
      this.JSON2XML();
      this.getMaxSymbolWidthFromJSON()

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
      let xadvance,
          yadvance;

      this.XMLText = `
<font>
  <info face="${this.font}" size="80" />
  <common lineHeight="80" scaleW="494" scaleH="479" pages="1" />
  <pages>
    <page id="0" file="${this.font}.png" />
  </pages>
  <chars count="${this.framesArr.length}">\n`

      this.framesArr.forEach(({frame,sourceSize}, index) => {
            //fill coordinates array for rendering
            let coordinates = {x:frame.x, y:frame.y}
            this.coordinatesArr.push(coordinates)

            //fill arr for getMaxSymbolWidthFromJSON method
            
            if(this.symbolsArr[index]==="." || this.symbolsArr[index] === ',') {
              xadvance = frame.w
              yadvance = frame.h
            }else{
              xadvance = this.getMaxSymbolWidthFromJSON();
              yadvance = this.getMaxSymbolHeightFromJSON()
            }

            let yoffset = (yadvance-sourceSize.h)/2
            let xoffset = (xadvance-sourceSize.w)/2
           
            let row =  `    <char id="${this.charCodeArr[index]}" x="${frame.x}" y="${frame.y}" width="${frame.w}" height="${frame.h}" xoffset="${xoffset}" yoffset="${yoffset}" xadvance="${xadvance}" /><!-- ${this.symbolsArr[index]} -->\n`
            this.XMLText += row

      })
      this.XMLText += `    <char id="32" x="0" y="0" width="0" height="0" xoffset="0" yoffset="0" xadvance="${xadvance}" /><!--   -->\n`
      this.XMLText += `    <char id="9" x="0" y="0" width="0" height="0" xoffset="0" yoffset="0" xadvance="${xadvance}" /><!--       -->\n`
      
      this.XMLText +=`  </chars>
  <kernings count="0">
  </kernings>
</font>`

    }

  },
}

</script>
<style>

</style>
