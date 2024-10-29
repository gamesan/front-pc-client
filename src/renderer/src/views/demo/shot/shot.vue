<!--
 * @Descripttion: 
 * @Author: yanghua
 * @version: 
 * @Date: 2024-09-09 16:36:07
 * @LastEditors: yanghua
 * @LastEditTime: 2024-09-18 16:22:28
-->
<template>
  <!-- 
   参考文档
   https://blog.csdn.net/aa4790139/article/details/141667428 
  -->
  <div
    class="demo-shot"
    ref="demoShot"
    :style="'background-image:url(' + bg + ')'"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @mousemove="onMouseMove"
  ></div>

  <div 
    class="shot-confirm"
    v-if="confirmShow"
    id="shotConfirm"
    :style="'top:' + confirmTop + 'px;left:' + confirmLeft + 'px;'">
    <el-button type="primary" size="small" @click="closeShot">取消</el-button>
    <el-button type="primary" size="small" @click="confirmShot">确定</el-button>
  </div>
</template>

<script setup>
import Konva from 'konva'
import { ref, onMounted, nextTick } from 'vue'

const { ipcRenderer } = window.electron
let demoShot = ref(null)
let bg = ref('')

let confirmShow = ref(false)
let confirmTop = ref(0)
let confirmLeft = ref(0)

let stage, layer, rect, transformer

onMounted(() => {
  ipcRenderer.send('shot_show_screen')
  ipcRenderer.removeListener('shot_get_screen', getSource)
  ipcRenderer.on('shot_get_screen', getSource)
})

async function getSource(event, source) {
  const { thumbnail } = source
  const pngData = await thumbnail.toDataURL('image/png')
  bg.value = pngData
  render()
}

function render() {
  stage = createStage()
  layer = createLayer(stage)
}

function createStage() {
  return new Konva.Stage({
    container: demoShot.value,
    width: window.innerWidth,
    height: window.innerHeight
  })
}

function createLayer(stage) {
  let layer = new Konva.Layer()
  stage.add(layer)
  layer.draw()
  return layer
}

function createRect(layer, x, y, width, height, alpha, draggable) {
  let rect = new Konva.Rect({
    x,
    y,
    width,
    height,
    fill: `rgba(0,0,255,${alpha})`,
    draggable
  })
  layer.add(rect)
  return rect
}

let isDown = false
let rectOption = {}
function onMouseDown(e) {
  if (rect || isDown) {
    return
  }
  isDown = true
  const { pageX, pageY } = e
  rectOption.x = pageX || 0
  rectOption.y = pageY || 0
  rect = createRect(layer, pageX, pageY, 0, 0, 0.25, false)
  rect.draw()
}

function onMouseMove(e) {
  if (!isDown) return
  const { pageX, pageY } = e
  let w = pageX - rectOption.x
  let h = pageY - rectOption.y
  rect.remove()
  rect = createRect(layer, rectOption.x, rectOption.y, w, h, 0.25, false)
  rect.draw()
}

function onMouseUp(e) {
  if (!isDown) {
    return
  }
  isDown = false
  const { pageX, pageY } = e
  let w = pageX - rectOption.x
  let h = pageY - rectOption.y
  rect.remove()
  rect = createRect(layer, rectOption.x, rectOption.y, w, h, 0, true)
  rect.draw()
  transformer = createTransformer(rect)
  layer.add(transformer)

  confirmShow.value = true
  nextTick(() => {
    const shotConfirm = document.getElementById('shotConfirm')
    confirmLeft.value = pageX - shotConfirm.offsetWidth
    confirmTop.value = pageY + 6
  })
}

function createTransformer(rect) {
  let transformer = new Konva.Transformer({
    nodes: [rect],
    rotateAnchorOffset: 60,
    enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
  })
  return transformer
}

/**
 * 根据选择区域生成图片
 * @param {*} info
 */
async function getShotImage(info) {
  const { x, y, width, height } = info
  let img = new Image()
  img.src = bg.value
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')
  canvas.width = ctx.width = width
  canvas.height = ctx.height = height
  ctx.drawImage(img, -x, -y, window.innerWidth, window.innerHeight)
  return canvas.toDataURL('image/png')
}

/**
 * 确认截图
 */
async function confirmShot() {
  const { width, height, x, y, scaleX = 1, scaleY = 1 } = rect.attrs
  let _x = width > 0 ? x : x + width * scaleX
  let _y = height > 0 ? y : y + height * scaleY
  let pic = await getShotImage({
    x: _x,
    y: _y,
    width: Math.abs(width) * scaleX,
    height: Math.abs(height) * scaleY
  })
  ipcRenderer.send('shot_finish_screen', pic)
}

/**
 * 关闭截图
 */
function closeShot() {
  ipcRenderer.send('shot_close_screen')
}

document.onkeydown = function (ev) {
  const code = ev.code
  if (code === 'Escape') {
    // esc 键退出截屏
    closeShot()
  } else if (code === 'Enter') {
    // enter 键截屏完成
    confirmShot()
  }
}
</script>

<style lang="less" scoped>
.demo-shot {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border: 2px solid blue;
  box-sizing: border-box;
  overflow: hidden;
  background-color: transparent;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.shot-confirm{
  position: fixed;
  background-color: #fff;
  padding: 5px 10px;
}
</style>
