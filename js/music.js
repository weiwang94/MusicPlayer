const audioId = '#ww-id-music-player'
const playId = '#id-img-play'
const preId = '#id-img-pre'
const nextId = '#id-img-next'
const CurrentTime = '#id-current-time'
const duration = '#id-duration'
const  Background = function(value) {
	return `linear-gradient(to right ,#f83232 0%,#f83232 ${value}%,#5b5b5b ${value}%, #5b5b5b 100%)`
}
const imgRoute = 'img/'
const PhototPlay = {
	play:'play.png',
	pause:'pause.png',
}
const BGPhoto = ['三生三世.png', '红日.png', 'YoungForYou.png', 'SunshineGirl.png']

const Voice = {
	voice:'vol.png',
	novoice:'novoice.png',
}
const Model = {
	ListPlay:'listPlay.png',
	LoopList:'loopList.png',
	LoopOne:'loopOne.png',
	Randome:'random.png',
}

const m0 = {
	singer: 'Yawn',
	name: '三生三世',
	duration: '04:17',
	wholeName: 'Yawn - 三生三世.mp3',
}
const m1 = {
	singer: '李克勤',
	name: '红日',
	duration: '04:47',
	wholeName: '李克勤 - 红日.mp3',
}
const m2 = {
	singer: 'GALA',
	name: 'Young For Young',
	duration: '03:39',
	wholeName: 'GALA - Young For You.mp3',
}
const m3 = {
	singer: 'moumoon',
	name: 'Sunshine Girl',
	duration: '03:52',
	wholeName: 'moumoon - Sunshine Girl.mp3',
}
const Musics = [m0, m1, m2, m3]
const musicRoute = 'music/'
// 添加歌曲到列表
var musicList = function() {
	var con = e('.ww-music-contaniner')
	for (var i = 0; i < Musics.length; i++) {
 		var	formEven = '<div class="ww-music-listSong even">'
		var formOdd = '<div class="ww-music-listSong odd">'
		var formChild = `
					<span class="ww-listSong-icon"></span>
					<span class="ww-listSong">${i + 1}</span>
					<span class="ww-listSong-song">${Musics[i].name}</span>
					<span class="ww-listSong-time">${Musics[i].duration}</span>
					<span class="ww-listSong-singer">${Musics[i].singer}</span>
		`
		if(i % 2 === 0) {
			var form = formEven + formChild + '</div>'
		}else {
			var form = formOdd + formChild + '</div>'
		}
		con.innerHTML += form
	}
}

// 添加歌曲列表的绑定事件
var bindmusicList = function() {
	var list = es('.ww-music-listSong')
	bindEvents(list, 'click', function(event) {
		var target = event.target
		var listSong = event.target.parentElement
		if(target.classList.contains('ww-music-listSong')) {
			listSong = target
		}
		log('listSong',listSong)
		// 改变图标
		var icon = listSong.querySelector('.ww-listSong-icon')
		log('icon',icon)
		if(icon != null) {
			icon.classList.remove('ww-listSong-icon')
			var i = e('.ww-listSong-icon-play')
			if(i != null) {
				i.classList.remove('ww-listSong-icon-play')
				i.classList.add('ww-listSong-icon')
			}
			icon.classList.add('ww-listSong-icon-play')

		}
		var iconPlay = listSong.querySelector('.ww-listSong-icon-play')
		if(iconPlay != null) {
			// // 播放歌曲
			var index = listSong.querySelector('.ww-listSong').innerHTML
			index = parseInt(index) - 1
			musicInit(index)
			playMusic()
		}
	})
}

// 改变当前播放图标
var chaneMusicIcon = function(index) {
	var list = es('.ww-music-listSong')
	// 使 正在播放的图片变灰
	var iconNow = e('.ww-listSong-icon-play')
	if(iconNow != null) {
		iconNow.classList.remove('ww-listSong-icon-play')
		iconNow.classList.add('ww-listSong-icon')
	}
	// 使将要播放的图标变亮
	var icon = list[index].querySelector('.ww-listSong-icon')
	icon.classList.add('ww-listSong-icon-play')
	icon.classList.remove('ww-listSong-icon')
}

var bindPlayMusic = function() {
	var play = e(playId)
	bindEvent(play, 'click', function() {
		if(play.dataset.state == 'pause') {
			var index = e(audioId).querySelector('source').dataset.list
			index = parseInt(index)
			log('bindPlayMusic', index)
			chaneMusicIcon(index)
			playMusic()
			play.dataset.state = 'play'
			play.src = imgRoute  + PhototPlay.pause
		}else if(play.dataset.state == 'play') {
			pauseMusic()
			play.dataset.state = 'pause'
			play.src = imgRoute + PhototPlay.play
		}else {
			log('bindPlayMusic bindEvent error')
		}
	})
}
// 设置 歌曲地址 和 当前歌曲序列 点亮当前播放的图标,并且重置进度条和进度时间
var musicInit = function(index) {
	var music = e(audioId)
	clearInterval(music.time)
	music.src = musicRoute + Musics[index].wholeName
	var source = music.querySelector('source')
	source.dataset.list = index
	chaneMusicIcon(index)
	changePhoto(index)
	resetMusicProgress(index)
	resetCD()
	changeMusicName(index)
	// 设置状态
	var play = e(playId)
	play.dataset.state = 'play'
	play.src = imgRoute  + PhototPlay.pause
}
var playMusic = function() {
	// log('click')
	var gan = e('.ww-gan')
	var ganMove = 'translateX(-50%) rotateZ(-5deg)'
	gan.style.transform = ganMove
	// var delay = 500
	// setTimeout(rotateCD, delay)
	var music = e(audioId)
	if(music.time != null) {
		clearInterval(music.time)
		music.time = null
	}
   	var b = true
	bindEvent(music, 'canplay', function() {
		music.play()
		showTime()
		rotateCD()
		b = false
	})
	if(b) {
		music.play()
		showTime()
		rotateCD()
	}
}
var pauseMusic = function() {
	var gan = e('.ww-gan')
	var ganMove = 'translateX(-50%) rotateZ(-30deg)'
	var music = e(audioId)
	gan.style.transform = ganMove
	var cd = e('.ww-rotate-cd')
	clearInterval(cd.interval)
	music.pause()
	clearInterval(music.time)
	// log('pauseMusic', music.currentTime)
}

// cd 转
var rotateCD = function() {
	var cd = e('.ww-rotate-cd')
	if(cd.interval == undefined) {
		cd.interval = null
	}
	if(cd.dregree == undefined) {
		cd.dregree = 0
	}
	clearInterval(cd.interval)
	cd.interval = setInterval(function() {
		cd.dregree = (cd.dregree + 0.25) % 360
		var style = `translateX(-50%) translateY(-50%) rotateZ(${cd.dregree}deg)`
		cd.style.transform = style
	}, 20)
}
// 重设 cd 转
var resetCD =function() {
	var cd = e('.ww-rotate-cd')
	var style = `translateX(-50%) translateY(-50%) rotateZ(0deg)`
	cd.dregree = 0
	cd.style.transform = style
}
// 换图片
var changePhoto = function(index) {
	var photo = e('#id-cd-cover')
	var bg = e('.bgbackground-0')
	var style=document.createElement('style')
	var cdStyle =  e('style')
	var background = `
		background: url(${imgRoute}${BGPhoto[index]}) center/100% fixed;
	`
	var cdBackground = `
		background: url(${imgRoute}${BGPhoto[index]}) center/100% no-repeat;
	`
	style.innerHTML=`.bgbackground::before{${background}}`
	cdStyle.innerHTML=`#id-cd-cover{${cdBackground}}`
	document.head.appendChild(style)
}
// 换歌曲名字
var changeMusicName = function(index) {
	var name = e('#id-current-music')
	var form = `${Musics[index].name} -- ${Musics[index].singer}`
	name.innerHTML = form
}

// 绑定上一首 和下一首选择音乐
var bindSelectMusic = function(element, select) {
	// select 为 1 时 是下一首
	// select 为 -1 时 是上一首
	bindEvent(element, 'click', function() {
		var index = musicListLoop(select)
		musicInit(index)
		playMusic()
	})
}
var bindPreNextMusic = function() {
	var pre = e(preId)
	bindSelectMusic(pre, -1)
	var next = e(nextId)
	bindSelectMusic(next, 1)
}
var resetMusicProgress = function(index) {
	e('#ww-id-music-progress').value = 0
	var bg = 'linear-gradient(to right ,#5b5b5b 0%, #5b5b5b 100%)'
	e('#ww-id-music-progress').style.background = bg
	var cTime = e(CurrentTime)
	var dTime = e(duration)
	cTime.innerHTML = '00:00'
	dTime.innerHTML = Musics[index].duration
}

//计算时间
var time = function(t) {
	var sec = Math.floor(t % 60)
	var min = Math.floor(t / 60)
	if(sec < 10) {
		sec = '0' + sec
	}
	if(min < 10) {
		min = '0' + min
	}
	return `${min}:${sec}`
}
//播放 时间显示
var showTime = function() {
	var music = e(audioId)
	var cTime = e(CurrentTime)
	var dTime = e(duration)
	music.time = setInterval(function() {
		var currentTime = music.currentTime
		var durationTime = music.duration
		if(durationTime != '' && currentTime != '') {
			cTime.innerHTML = time(currentTime)
			dTime.innerHTML = time(durationTime)
			let value = Math.floor(currentTime / durationTime * 1000) * 0.1
			showProgress(value)
		}
	}, 100)

}
var showProgress = function(value) {
	var progress = e('#ww-id-music-progress')
	progress.value = value
	progress.style.background = Background(value)
}

//绑定 改变歌曲进度
var bindEventPlayProgress = function() {
	var progress = e('#ww-id-music-progress')
	bindEvent(progress, 'input', function() {
		var music = e(audioId)
		clearInterval(music.time)
		log('bindEventPlayProgress',music.time)
		var value = progress.value
		// 改变进度背景
		progress.style.background = Background(value)
		// 改变时间显示
		var currentTime = value / 100 * music.duration
		music.currentTime = currentTime
		var durationTime = music.duration
		var cTime = e(CurrentTime)
		var dTime = e(duration)
		cTime.innerHTML = time(currentTime)
		dTime.innerHTML = time(durationTime)
	})
	// 改变歌曲播放
	bindEvent(progress, 'change', function() {
		var music = e(audioId)
		clearInterval(music.time)
		log('bindEventPlayProgress + 1',music.time)
		var value = progress.value
		var currentTime = value / 100 * music.duration
		if(value == 100) {
			music.currentTime = currentTime - 1
		}else {
			music.currentTime = currentTime
		}
	})
}
// 绑定 改变声音进度
var bindEventVoiceProgress = function() {
	var progress = e('#ww-id-vol-progress')
	bindEvent(progress, 'input', function() {
		var value = progress.value
		// 改变进度背景
		progress.style.background = Background(value)
		e(audioId).volume = value / 100
	})
}
// 绑定 改变声音
var bindEventVoice = function() {
	var voice = e('#ww-id-voice')
	bindEvent(voice, 'click', function() {
		var state = voice.dataset.state
		log(voice.dataset.state)
		if(state === 'voice'){
		   voice.dataset.state = 'novoice'
		   voice.src = imgRoute + Voice.novoice
		   e(audioId).volume = 0
		   e('.ww-music-progress').dataset.volume = 0
	   	}else if(state === 'novoice') {
		   voice.dataset.state = 'voice'
		   voice.src = imgRoute + Voice.voice
		   e(audioId).volume = e('#ww-id-vol-progress').value / 100
		   e('.ww-music-progress').dataset.volume = 1
	   }else {
		   log('bindEventVoice error')
	   }
	})
	bindEventVoiceProgress()
}

// 绑定 播放模式
var bindEventPlayModel = function() {
	// 有四种循环方式
	// 默认是顺序播放
	var model = e('#id-music-order')
	var index = 0
	model.select = 0
	var form = ['顺序播放','列表循环','单曲循环','随机播放']
	bindEvent(model, 'click', function() {
		// 切换四种播放模式图片和提示
		var src = model.src
		if(e('.ww-model-tip').classList.contains('hide')) {
			e('.ww-model-tip').classList.remove('hide')
		}
		// log('src',src)
		switch(index) {
			case 0:
			model.src = imgRoute + Model.LoopList
			index = 1
			e('.ww-model-tip').innerHTML = form[index]
			break;
			case 1:
			model.src = imgRoute + Model.LoopOne
			index = 2
			e('.ww-model-tip').innerHTML = form[index]
			break;
			case 2:
			model.src = imgRoute + Model.Randome
			index = 3
			e('.ww-model-tip').innerHTML = form[index]
			break;
			case 3:
			model.src = imgRoute + Model.ListPlay
			index = 0
			e('.ww-model-tip').innerHTML = form[index]
			break;
		}
		model.select = index
		// 延时加上 hide
		setTimeout(addhide, 2000)
	})

	bindMusicEnd()
}
var addhide = function() {
	var tip = e('.ww-model-tip')
	if(!tip.classList.contains('hide')) {
		log('hide')
		tip.classList.add('hide')
	}
}
var modelIndex =  function(select) {
	var index = 0
	switch(select) {
		case 0:
		index = musicListPlay()
		break
		case 1:
		index = musicListLoop()
		break
		case 2:
		index = musicLoopOne()
		break
		case 3:
		index = musicRandom()
		default:
		// log('modelIndex case', index, select)
	}
	// log('modelIndex + 1', index)
	return index
}
var bindMusicEnd = function() {
	var music = e(audioId)
	var source = e(audioId).querySelector('source')
	var model = e('#id-music-order')
	bindEvent(music, 'ended', function() {
		var select = model.select
		log('select', select)
		var index = modelIndex(select)
		log('bindMusicEnd', index)
		if(index > Musics.length - 1) {
			log('bindMusicEnd error')
			return // 处理没有歌曲意外情况
		}
		var src = musicRoute + Musics[index].wholeName
		clearInterval(music.time)
		musicInit(index)
		playMusic()
	})
}
var musicListPlay = function() {
	var source = e(audioId).querySelector('source')
	var index = parseInt(source.dataset.list)
	if(index === Musics.length - 1) {
		// 没有音乐可以播放了
		log('没有音乐可以播放了')
		e('#id-img-play').src = imgRoute + PhototPlay.play
		e('#id-img-play').dataset.state = 'pause'
		resetMusicProgress(index)
		// 使 正在播放的图片变灰
		var iconNow = e('.ww-listSong-icon-play')
		if(iconNow != null) {
			iconNow.classList.remove('ww-listSong-icon-play')
			iconNow.classList.add('ww-listSong-icon')
		}
		var source = e(audioId).querySelector('source')
		source.dataset.list = 0
		e(audioId).src = musicRoute + Musics[0].wholeName
		changePhoto(0)
	}
	index += 1
	// log('musicListPlay, index', index)
	return index
}
var musicListLoop = function(select = 1) {
	var source = e(audioId).querySelector('source')
	var index = parseInt(source.dataset.list)
	if(index === Musics.length - 1 && select === 1) {
		// 从头开始播放音乐
		// log('start')
		index = -1
	}else if(index === 0 && select === -1) {
		// 从最后一个播放
		// log('end')
		index = Musics.length
	}
	index += select
	// log('musicListLoop', index)
	return index
}
var musicLoopOne = function() {
	var source = e(audioId).querySelector('source')
	var index = parseInt(source.dataset.list)
	return index
}
var musicRandom = function() {
	var source = e(audioId).querySelector('source')
	var index = Math.floor(Math.random() * Musics.length)
	log('index +1 ', index)
	log('musicRandom', index)
	return  index
}



var bindMusic = function() {
	bindPlayMusic()
	bindPreNextMusic()
	bindEventVoice()

 	bindEventPlayProgress()

	bindEventPlayModel()
	bindmusicList()
}
var _main = function() {
	musicList()
	bindMusic()
}
_main()
