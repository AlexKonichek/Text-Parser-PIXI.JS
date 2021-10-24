<template>
  <div>
    <div class="row m-3">
      <div class="col-sm-6">
        <button class="btn btn-success btn-lg m-3"  v-on:click="showPreview">Show preview</button>
        <Preview v-if="showPreviewComponent"
            :arrSymbolsParams="arrSymbolsParams"
            :textures="textures"
            :symbolsMap="symbolsMap"
        />
      </div>
      <div  class="col-sm-6">
        <div class="form-group">
          <label class="h4 text-dark" for="XML">XML</label>
          <textarea class="form-control" id="XML" v-model="XMLText" rows="28" cols="50"></textarea>
          <button class="btn btn-success btn-lg m-3"  v-on:click="this.downloadXML">Save XML</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Preview from "./Preview";

export default {
  name: "XML_Creator",
  components: {Preview},
  data() {
    return {
      xadvanceCurrent: null,
      comaOrDotExist:false,
      XMLFileName: "",
      scale: "",
      smallSymbolsWidthsArr: [],
      framesArr: [],
      framesWidths: [],
      framesHeights: [],
      coordinatesArr:[],
      charCodeArr:[],
      XMLText:"",
      font: 'font family',
      maxWidthReady: false,
      symbols: this.inputSymbols,
      showTextArea:false,
      xOffset:null,
      xoffsetForSymbolCorrectingXAdvance:0,
      yOffset:null,
      arrSymbolsParams:[],
      showPreviewComponent:false
    }
  },
  props: ["symbolForCorrectingXOffset","symbolsMap","dataReady","JSONtext", "symbolsArr", "finalXAdvance","finalSmallXAdvance", "arrSymbolsWidths", "arrSmallSymbolsWidth", "smallSymbolsXadvance","symbolWidth", "textures"],
  watch: {
    xoffsetForSymbolCorrectingXAdvance: function(){
      this.$emit("xOffsetForRendererChange",this.xoffsetForSymbolCorrectingXAdvance)
    },
    xOffset: function () {
      console.log("xOffset:",this.xOffset)
      this.$emit("xOffsetChange",this.xOffset)
    },
    
    finalXAdvance: function () {
      this.xadvanceCurrent = Number(this.finalXAdvance)
      console.log("finalXAdvance change in xml creator", this.xadvanceCurrent)
      this.JSON2XML()
    },
    finalSmallXAdvance: function () {
      console.log("finalSmallXAdvance change in xml creator", this.finalSmallXAdvance)
      this.JSON2XML()
    },
    symbolsArr: function () {
      console.log("symbolsArr in XML-creatore is changed")
      this.fillCharcodeArr()
      this.JSON2XML()
    },
    dataReady: function () {
      console.log("dataReady")
      this.prepareDataForXML()
      
    }
  },
  computed: {},
  mounted() {
  this.prepareDataForXML()
},
  methods: {
    prepareDataForXML() {
      console.warn("XML-creator:prepareDataForXML")
      this.fillCharcodeArr()
      let data = JSON.parse(this.JSONtext)
      let frames = Object.values(data)[0]
      //this.canvasSize = Object.values(data)[1].size
      this.XMLFileName = Object.values(data)[1].image
      this.scale = Object.values(data)[1].scale
      this.font = Object.values(data)[1].image.split(".")[0]
      this.framesArr = Object.values(frames)
      this.framesArr.forEach(frame => {
        this.framesWidths.push(frame.sourceSize.w)
        this.framesHeights.push(frame.sourceSize.h)
      })
      this.yadvance = this.maxSymbolHeightFromJSON()

      this.isDataReady();
  
    },
    isDataReady(){
      if(this.font 
         && this.framesHeights.length > 0
         && this.framesWidths.length > 0
         && this.framesArr.length > 0
         && this.charCodeArr.length > 0
         && this.finalXAdvance){
           console.warn("Data for XML is ready")
           this.JSON2XML()
           this.showTextArea = true


         }
         else {
           throw new Error("Data for XML is not ready")
         }

    },
    downloadXML() {
      let xmltext = this.XMLText;
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

    maxSymbolHeightFromJSON() {
      return Math.max(...this.framesHeights)
    },

    fillCharcodeArr() {
      this.charCodeArr = []
      this.symbolsArr.forEach(symbol => {
        this.charCodeArr.push(symbol.charCodeAt(0))
      })
      console.log("fillCharcodeArr:", this.charCodeArr )
    },
    showPreview(){
      this.showPreviewComponent = true
    },

    JSON2XML() {
      this.arrSymbolsParams = []
     // console.warn("JSON2XML");
      //first part of XML file
      this.XMLText = `
<font>
  <info face="${this.font}" size="${this.framesHeights[0]}" />
  <common lineHeight="${this.framesHeights[0]}" scaleW="494" scaleH="479" pages="1" />
  <pages>
    <page id="0" file="${this.font}.png" />
  </pages>
  <chars count="${this.framesArr.length + 2}">\n`
       //+ Number(this.changeYAdvance)

      this.framesArr.forEach(({frame, sourceSize, spriteSourceSize}, index) => {

            //define xadvance for dot,comma or similar small symbol
            //to do add arr of all possibly small symbols and checking if it have a current symbols
            if((this.symbolsArr[index] === "," || this.symbolsArr[index] === "." || this.symbolsArr[index] === "×")) {
                //this.xadvanceCurrent = this.smallSymbolsXadvance
                this.yadvance =  sourceSize.h
                this.xadvanceCurrent = this.finalSmallXAdvance
                }

              //define xadvance for plain symbols
              else {
                this.xadvanceCurrent = this.finalXAdvance
              }


            this.xOffset = (Number(this.xadvanceCurrent)- sourceSize.w) / 2
            this.yOffset = (Number(this.yadvance)- sourceSize.h) / 2

            if(this.symbolsArr[index] === this.symbolForCorrectingXOffset){
              console.warn(this.symbolsArr[index],this.xOffset)
              this.xoffsetForSymbolCorrectingXAdvance = this.xOffset
            }
            

            let row = `    <char id="${this.charCodeArr[index]}" x="${frame.x}" y="${frame.y}" width="${frame.w}" height="${frame.h}" xoffset="${this.xOffset}" yoffset="${this.yOffset}" xadvance="${this.xadvanceCurrent}" /><!-- ${this.symbolsArr[index]} -->\n`
              this.XMLText += row

              let symbolsParams = {
                  name:this.symbolsArr[index],
                  xoffset:this.xOffset,
                  width:frame.w,
                  x:frame.x,
                  y:frame.y
              }
              this.arrSymbolsParams.push(symbolsParams)
        });
      this.$emit("symbolParamsIsReady",this.arrSymbolsParams)

      //end part of XML file
      this.XMLText += `    <char id="32" x="0" y="0" width="0" height="0" xoffset="0" yoffset="0" xadvance="${this.xadvanceCurrent}" /><!--   -->\n`
      this.XMLText += `    <char id="9" x="0" y="0" width="0" height="0" xoffset="0" yoffset="0" xadvance="${this.xadvanceCurrent}" /><!--       -->\n`
      this.XMLText += `  </chars>
        <kernings count="0">
        </kernings>
        </font>`
    }
  }
}

</script>
