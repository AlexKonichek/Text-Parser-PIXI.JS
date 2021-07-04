<template>
    <modal name="ErrorDialog">
        <h1>OOOPS!</h1>
        <p>It seems some error occurred...Please refresh the page and try once more</p>
        <button v-on:click="refresh">Refresh</button>
    </modal>
</template>

<script>
export default {
    name: 'ErrorDialog',
    mounted () {
       
    },
    methods:{
        refresh(){
            location.reload()
        }
    }
}
</script>
