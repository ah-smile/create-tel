<template>
	<view class="box">
		<view class="uni-title">地区：{{province+' '+city}} </view>
		<picker-view :value="pickItem" @change="pickerChange">
			<picker-view-column>
				<view class="item" v-for="(item,index) in areaList" :key="index">{{item.province}}</view>
			</picker-view-column>
			<picker-view-column>
				<view class="item" v-for="(item,index) in cityList" :key="index">{{item}}</view>
			</picker-view-column>
		</picker-view>
		<view class="uni-title">选择生成个数</view>
		<picker @change='handNumChange' :value="numIndex" :range="option">
			<view class="uni-input">{{option[numIndex]}}</view>
		</picker>
		<button type="warn" @click="createTel">生成</button>
		<view class="code">
			<image src="../../static/github-logo.png"></image>
			<a href='https://github.com/smilehxf/create-tel' target='_blank'>源代码</a>
		</view>
		<view class="author">酷安：Smile233</view>
	</view>
</template>
<script>
	const BASE_URL = '/createTel'
	// const BASE_URL = 'http://localhost:2333'
	import areaList from './areaList.js'

	export default {
		data() {
			return {
				option: [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
				numIndex: 0,
				pickItem: [4, 0],
				areaList: areaList,
				cityList: areaList[4].city,
				province: '',
				city: ''
			}
		},
		onLoad() {
			this.province = areaList[this.pickItem[0]].province
			this.city = this.cityList[this.pickItem[1]]
		},
		methods: {
			pickerChange(e) {
				this.pickItem = e.detail.value
				this.cityList = areaList[this.pickItem[0]].city
				this.province = areaList[this.pickItem[0]].province
				this.city = this.cityList[this.pickItem[1]]
			},
			handNumChange(e) {
				this.numIndex = e.target.value
			},

			createTel() {
				uni.request({
					url: BASE_URL + '/newCreateTel',
					method: 'POST',
					data: {
						province: this.province,
						city: this.city,
						total: this.option[this.numIndex]
					},
					success(res) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
							mask: true,
						})
						if (!res.data.code) {
							window.open(BASE_URL + '/download', '_self')
						}
					}
				})
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #F4F5F6;

		.box {
			margin: 5% auto;
			width: 670rpx;

			picker-view {
				margin-top: 20rpx;
				height: 400rpx;
				text-align: center;
			}

			picker {
				padding: 20rpx;
				margin-top: 20rpx;
				background-color: white;
			}

			.uni-title {
				margin-top: 20rpx;
			}

			button {
				margin-top: 40rpx;
			}
		}

		.author {
			margin-top: 100rpx;
			text-align: center;
		}

		.code {
			margin-top: 60rpx;
			display: flex;
			line-height: 40px;
			justify-content: center;
			align-items: center;

			image {
				width: 24px;
				height: 24px;
				margin-right: 10rpx;
			}

			a {
				color: #0366D6;
				text-decoration: none;
			}
		}
	}
</style>
