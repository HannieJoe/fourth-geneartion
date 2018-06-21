<template>
    <div id="realtimeCommandVideos">
        <div class="title">
            <span>视频通话</span>
            <div class="opt-btns">
                <el-button class="tinyBtn" type="primary" plain size="mini" @click="showNum(1)">一屏</el-button>
                <el-button class="tinyBtn" type="primary" plain size="mini" @click="showNum(2)">四屏</el-button>
                <el-button class="tinyBtn" type="primary" plain size="mini" @click="showNum(3)">九屏</el-button>
                <b class="dialogClose" @click="closeDialog()">x</b>
            </div>
        </div>
        <div class="container">
            <div class="videosWrap" ref="videosWrap">
                <el-row v-for="row in videos" :key="row.index">
                    <el-col :span="videosShowNum==1?24:videosShowNum==2?12:8" v-for="col in videos" :key="col.index">
                        <div class="video" :style="{height:videoHeight+'px'}"></div>
                    </el-col>
                </el-row>
            </div>
            <div class="gridWrap" :style="{top:gridTop+'px',position:'absolute',width:'100%',bottom:'0px'}"></div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        devs: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            videosShowNum: 1,
            videoHeight: '20px',
            gridTop: '20px',
            videos: [],
        }
    },
    created() {

    },
    methods: {
        showNum(num) {

            this.videosShowNum = num;
            this.videos = new Array(num).fill(num);
            let videoWidth = this.$refs.videosWrap.getBoundingClientRect().width;
            this.videoHeight = videoWidth / this.videosShowNum * 0.75;
            this.gridTop = videoWidth * 0.75 + 5;
        },
        closeDialog() {
            this.$emit('colseVideosDialog');
        },
    },
    mounted() {

        // 设置初始videoShowNum
        if (this.devs.length >= 9) {
            this.videosShowNum = 3;

        } else if (this.devs.length >= 4) {
            this.videosShowNum = 2;
        } else {
            this.videosShowNum = 1;
        }
        this.videos = new Array(this.videosShowNum).fill(this.videosShowNum);;
        this.showNum(this.videosShowNum);
        console.log(this.$refs.videosWrap.getBoundingClientRect().width);
        let videoWidth = this.$refs.videosWrap.getBoundingClientRect().width;
        this.videoHeight = videoWidth / this.videosShowNum * 0.75;
        this.gridTop = videoWidth * 0.75;
    }
}
</script>
<style lang="less" scoped>
@import '~@/styles/vars.less';
#realtimeCommandVideos {
    position: relative;
    width: 40%;
    height: 100%;
    border: 1px solid #aaa;
}

.title {
    height: 30px;
    line-height: 30px;
    padding-left: 5px;
    padding-right: 5px;
    background-color: @head-bg;
}

.opt-btns {
    float: right;
}

.el-button+.el-button {
    margin-left: 0;
}

.tinyBtn {
    padding: 4px 7px;
}

.dialogClose {
    margin-left: 5px;
    padding: 5px 5px;
    line-height: 30px;
    cursor: pointer;
}

.dialogClose:hover {
    color: #616DF9;
}


.container {
    position: absolute;
    width: 100%;
    top: 30px;
    bottom: 0;
}

.videosWrap {
    width: 100%;
}

.gridWrap {
    border: 1px solid #500;
}

.video {
    width: 100%;
    height: 100%;
    background-color: #aff;
    border: 1px solid #500;
}
</style>


