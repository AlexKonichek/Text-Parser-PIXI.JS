<template>
  <div>
    <div v-if="showOpenFile">
      <label class="m-3">
        Open Files
        <input type="file" class="btn btn-secondary btn-lg m-3" multiple accept="application/JSON,image/*" @change="loadTextFromFile" >
      </label>
    </div>
    <div v-if="showImage">
      <h1>Image preview</h1>
      <div  class="card" style="width: 15rem">
        <img ref="img" src="" class="card-img-top" alt="image preview">
      </div>
    </div>
    <div v-if="showError" class="alert alert-danger" role="alert">
      You must choose 2 files: JSON and PNG!
    </div>
  </div>

</template>

<script>
export default {
  data: ()=>{
    return {
      showImage:false,
      showOpenFile:true,
      showError:false
    }
  },
  methods: {
    loadTextFromFile(ev) {
      let jsonfile,imageFile
      const fileListAsArray = Array.from(ev.target.files)
      if(fileListAsArray.length!==2) {
        this.showError = true
      }else{
        this.showError = false
        fileListAsArray.forEach(file => {
        if(file.type === "application/json") {
          jsonfile=file
          const reader = new FileReader();
          reader.onload = e => {
            this.$emit("load", e.target.result);
          }
          reader.readAsText(jsonfile);
        }
        if(file.type ==="image/png") {
          imageFile=file
          this.showImage=true
          let reader = new FileReader();
          reader.onload = e => {
            this.$emit("image", reader.result);
            this.$refs.img.src = reader.result;
            this.showOpenFile=false

          }
          reader.readAsDataURL(file);
        }
      })
       this.$emit("json",jsonfile)

      }
      

     
      
    }
  }
};
</script>

<style>
.text-reader {
  position: relative;
  overflow: hidden;
  display: inline-block;

  /* Fancy button looking */
  border: 2px solid black;
  border-radius: 5px;
  padding: 12px 18px;
  cursor: pointer;
}
.text-reader input {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
}
</style>