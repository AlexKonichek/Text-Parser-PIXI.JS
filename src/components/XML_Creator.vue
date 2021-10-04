<template>
<div>
  <div v-if="showTextArea" class="row h-25 m-3">
    <div class="col-sm-6">
      <div class="form-group">
        <label class="h4 text-dark" for="JSON">JSON</label>
        <textarea class="form-control" id="JSON" v-model="JSONtext" rows="22" cols="50"></textarea>

      </div>
    </div>
    <div  class="col-sm-6">
      <div class="form-group">
        <label class="h4 text-dark" for="XML">XML</label>
        <textarea class="form-control" id="XML" v-model="XMLText" rows="22" cols="50"></textarea>
        <button class="btn btn-success btn-lg m-3"  v-on:click="this.downloadXML">Save XML</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "XML_Creator",
  data() {
    return {
      comaOrDotExist:false,
      XMLFileName: "",
      scale: "",
      comaAndDotWidthsArr: [],
      maxSmallSymbolWidth:[],
      framesArr: [],
      framesWidths: [],
      framesHeights: [],
      coordinatesArr:[],
      symbolsArr: [],
      charCodeArr:[],
      XMLText:"",
      font: 'font family',
      maxWidthReady: false,
      symbols: this.inputSymbols,
      showTextArea:false
    }
  },
  props: ["XML", "JSONtext", "inputSymbols", "allowToCreateXML"],
  watch: {
    allowToCreateXML: function () {
      console.warn("allowToCreateXML");
      if(this.allowToCreateXML) {
        this.parseJSONtext();
        this.fillCharcodeArr()
      }
    },
    inputSymbols: function () {
      this.fillCharcodeArr()
    }
  },
  computed: {},
  methods: {
    parseJSONtext() {
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
      this.framesNames = Object.keys(frames)
      this.maxWidthReady = true
      this.JSON2XML()
      //this.$refs.inputSymbols.focus()
      //this.prepareToRender()
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

    getMaxSymbolWidthFromJSON() {
      return Math.max(...this.framesWidths)
    },

    getMaxSmallSymbolWidthFromJSON() {
      return Math.max(...this.comaAndDotWidthsArr)
    },
    maxSymbolHeightFromJSON() {
      console.log(Math.max(...this.framesHeights))
      return Math.max(...this.framesHeights)
    },
    fillCharcodeArr() {
      console.warn("fillCharcodeArr")
      this.charCodeArr = []
      this.inputSymbols.forEach(symbol => {
        this.charCodeArr.push(symbol.charCodeAt(0))
      })


    },


    JSON2XML() {
      let yoffset,
          xoffset;
      this.xadvance = this.getMaxSymbolWidthFromJSON()
      //first part of XML file

      this.XMLText = `
<font>
  <info face="${this.font}" size="${this.framesHeights[0]}" />
  <common lineHeight="${this.framesHeights[0]}" scaleW="494" scaleH="479" pages="1" />
  <pages>
    <page id="0" file="${this.font}.png" />
  </pages>
  <chars count="${this.framesArr.length + 2}">\n`

      this.yadvance = this.maxSymbolHeightFromJSON() //+ Number(this.changeYAdvance)

        this.framesArr.forEach(({frame, sourceSize, spriteSourceSize}, index) => {

          //fill coordinates array for rendering
          let coordinates = {
            x: frame.x,
            y: frame.y,
            sourceSize: {
              w: sourceSize.w,
              h: sourceSize.h
            }
          }
          this.coordinatesArr.push(coordinates)
          // //define xadvance for dot,comma or similar small symbol
          if (this.symbolsArr[index] === "." || this.symbolsArr[index] === ',') {
            //console.warn(this.symbolsArr[index])
            this.comaAndDotWidthsArr.push((sourceSize.w))
            this.maxSmallSymbolWidth = Math.max(...this.comaAndDotWidthsArr)
            if (!this.maxSmallSymbolWidth) {
             // console.warn("!this.maxSmallSymbolWidth")
              this.xadvance = Number(this.getMaxSmallSymbolWidthFromJSON())
            } else {
              this.xadvance = Number(this.maxSmallSymbolWidth)
            }
            this.yadvance = frame.h //+ Number(this.changeYAdvance)
          }

          //define xadvance for plain symbols
          else {
            if (!this.maxSymbolWidth) {
              this.xadvance = Number(this.getMaxSymbolWidthFromJSON()) //+ Number(this.changeXAdvance)
            } else {
              this.xadvance = Number(this.maxSymbolWidth) //+ Number(this.changeXAdvance)
            }

          }
          yoffset = (sourceSize.h - Number(this.yadvance)) / 2
          xoffset = (sourceSize.w - Number(this.xadvance)) / 2
          console.warn(this.xadvance, yoffset, xoffset);

          let row = `    <char id="${this.charCodeArr[index]}" x="${frame.x}" y="${frame.y}" width="${frame.w}" height="${frame.h}" xoffset="${xoffset}" yoffset="${yoffset}" xadvance="${this.xadvance}" /><!-- ${this.inputSymbols[index]} -->\n`
          this.XMLText += row
        });

      //end part of XML file
      this.XMLText += `    <char id="32" x="0" y="0" width="0" height="0" xoffset="0" yoffset="0" xadvance="${this.xadvance}" /><!--   -->\n`
      this.XMLText += `    <char id="9" x="0" y="0" width="0" height="0" xoffset="0" yoffset="0" xadvance="${this.xadvance}" /><!--       -->\n`
      this.XMLText += `  </chars>
        <kernings count="0">
        </kernings>
        </font>`
     this.showTextArea = true
    }
  }
}




</script>
