<template>
	<view class="box">
		<view class="uni-title">号码前7位(支持多项用;分割)</view>
		<textarea focus auto-height placeholder="输入号码前7位" v-model="num" />
		<view class="uni-title">选择生成方式</view>
		<picker @change='handWayChange' :value="wayIndex" :range="way">
			<view class="uni-input">{{way[wayIndex]}}</view>
		</picker>
		<view class="uni-title">选择生成个数</view>
		<picker @change='handNumChange' :value="numIndex" :range="option">
			<view class="uni-input">{{range[numIndex]}}</view>
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
	export default {
		data() {
			return {
				num: '',
				way: ['有序', '随机'],
				wayIndex: 0,
				option: [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
				range: [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
				numIndex: 0,
			}
		},
		methods: {
			handWayChange(e) {
				this.wayIndex = e.target.value
				this.numIndex = 0
				if (this.wayIndex === 0) {
					this.option = this.range
				}
				if (this.wayIndex === 1) {
					this.option = this.range.slice(0, 5)
				}
			},
			handNumChange(e) {
				this.numIndex = e.target.value
			},
			createTel() {
				let nums = this.num.split(';').filter(item=>item.length===7)
				if (this.num.length < 7||(!nums.length&&this.num.length > 7)) {
					let msg = ''
					if(this.num.length < 7)msg =' 输入不足7位！'
					if(!nums.length&&this.num.length > 7)msg =' 没有一项位数为7或位数超过7'
					return uni.showToast({
						title:msg,
						icon: 'none',
						mask: true,
					})
				}
				uni.request({
					url: BASE_URL + '/createTel',
					method: 'POST',
					data: {
						num: nums,
						select:this.wayIndex,
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
			},
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #F4F5F6;

		.box {
			margin: 5% auto;
			width: 670rpx;

			textarea,
			picker {
				padding: 20rpx;
				margin-top: 20rpx;
				background-color: white;
			}
			textarea{
				width: 630rpx;
			}

			.uni-title {
				margin-top: 20rpx;
			}

			button {
				margin-top: 40rpx;
			}
		}

		.author {
			margin-top: 80rpx;
			text-align: center;
		}
		.code{
			margin-top: 60rpx;
			display: flex;
			line-height: 40px;
			justify-content: center;
			align-items: center;
			image{
				width: 32px;
				height: 32px;
				margin-right: 10rpx;
			}
		a{
			text-decoration: none;
		}	
		}
	}
</style>
