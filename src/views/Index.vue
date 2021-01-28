<template>
	<div class="out-box">
		<div class="in-box">
			<div class="head-box">
				<a class="hd-logo fl">
					<img src="../assets/image/logo.png" />
				</a>
				<div class="hd-bar fr">
					<el-button type="success" @click="$router.push('/login')">进入下单</el-button>
				</div>
			</div>
			<div class="content1">
				<div class="text fl">
					<h2>用AmzBuy 提升亚马逊销量</h2>
					<p style="padding: 50px 0px">诚信、安全、简单、登录即可使用<br><br>省钱、省时、稳定、自由，大大提高工作效率，让电商更加便捷有价值</p>
					<el-button size="mini" type="success" @click="$router.push('/login')">进入下单</el-button>
				</div>
				<div class="img fr">
					<img src="../assets/image/banner.png">
				</div>
				<br clear="all" />
			</div>
			<div class="content2">
				<div class="title">
					<h2>平台优势</h2>
					<p>省钱、省时、稳定、自由 提供专业的解决方案</p>
				</div>
				<div class="con-box">
					<div>
						<span><img src="../assets/image/ad3.png"></span>
						<h3>省钱</h3>
						<p>更专业的服务 更低的费用</p>
					</div>
					<div>
						<span><img src="../assets/image/ad1.png"></span>
						<h3>省时</h3>
						<p>注册登录即可使用 订单处理迅速</p>
					</div>
					<div>
						<span><img src="../assets/image/ad4.png"></span>
						<h3>稳定</h3>
						<p>服务稳定 安全可靠 无后顾之忧</p>
					</div>
					<div>
						<span><img src="../assets/image/ad2.png"></span>
						<h3>自由</h3>
						<p>无其他额外费用，使用自由把控</p>
					</div>
				</div>
			</div>
			<div class="content3">
				<div class="title">
					<h2>关于我们</h2>
					<p>amzBuy研发团队，拥有精湛、深厚的技术功底</p>
				</div>
				<div class="con-box">
					<p>具有多年电商系统开发经验，专注于数据挖掘和跨境电商云服务开发。</p>
					<p>管理团队，是一群资深外贸人员，拥有超过10年的跨境电商实战与传统行业运营经验，充分了解跨境电商卖家的需求和行业发展方向，为您的跨境之路保驾护航。</p>
				</div>
				<div class="btn">
					<el-button type="success" @click="$router.push('/login')">进入下单</el-button>
				</div>
			</div>
			<div class="footer">
				<div class="copyright">Copyright © AmzBuy All Rights Reserved.</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	body {
		margin: 0;
		padding: 0;
	}

	ul,
	li {
		list-style: none;
	}

	.fl {
		float: left;
	}

	.fr {
		float: right;
	}

	.out-box {
		width: 100%;
	}

	.head-box {
		height: 68px;
		line-height: 68px;
		background-color: #0571FF;
		width: 80%;
		padding: 0 10%;
	}

	.hd-logo {
		height: 100%;
		line-height: 68px;
		margin-left: 40px;
		color: #FFFFFF;
		font-size: 24px;
		font-weight: bold;
		font-style: oblique;
		letter-spacing: 4px
	}

	.hd-logo img {
		vertical-align: middle;
		width: 250px;
		margin-top: -5px;
	}

	.hd-bar {
		height: 68px;
		line-height: 68px;
		color: #FFFFFF;
	}

	.content1 {
		background: #4466FF;
		padding: 5% 20%;
	}

	.content1 .text {
		color: #FFFFFF;
	}

	.content2 {
		width: 70%;
		padding: 5% 15%;
	}

	.content2 .title {
		text-align: center;
		padding: 0 0 50px 0
	}

	.content2 .con-box {
		display: flex;
		justify-content: space-between;
		text-align: center;
	}

	.content3 {
		width: 70%;
		padding: 5% 15%;
		background: #f8f8f8;
		text-align: center;
	}

	.content3 .con-box {
		margin-top: 50px;
	}

	.content3 .btn {
		margin-top: 80px;
	}

	.footer {
		background: #333;
		padding: 30px 0;
	}

	.copyright {
		color: #ccc;
		text-align: center;
	}
</style>
