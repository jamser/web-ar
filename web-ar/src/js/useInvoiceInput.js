import { $ } from '../utils/util.js'
import Bus from '../js/bus.js'

const useInvoiceInput = () => {

	let timer
	let recorder
	let checkTimer
	let lastRecorder
	// let audio = $('audio')
	const invoiceBtn = $('#voiceInput')

	function startRecording() {
		lastRecorder = recorder || null
		HZRecorder.get(function (rec) {
			recorder = rec
			recorder.start();
		});
	}

	function stopRecording() {
		console.log('停止录音')
		invoiceBtn.style.background = 'url("./assets/voice.png")'
		invoiceBtn.style.backgroundSize = '100% 100%'
		recorder.stop();
	}

	// function playRecording() {
	// 	conpole.log('播放录音')
	// 	recorder.play(audio);
	// }

	function uploadAudio() {
		console.log('上传录音')
		recorder.upload("/api/audio", function (state, e) {
			switch (state) {
				case 'uploading':
					//var percentComplete = Math.round(e.loaded * 100 / e.total) + '%';
					break;
				case 'ok':
					Bus.$emit('say', e.target.responseText)
					break;
				case 'error':
					alert("上传失败");
					break;
				case 'cancel':
					alert("上传被取消");
					break;
			}
		});
	}

	invoiceBtn.addEventListener("touchstart", function (e) {
		console.log('touchstart');
		timer = setTimeout(function () {
			checkTimer = true
			console.log('LongPress');
			invoiceBtn.style.background = 'url("./assets/voice2.png")'
			invoiceBtn.style.backgroundSize = '100% 100%'
			startRecording()
			e.preventDefault();
		}, 300);
	});
	// invoiceBtn.addEventListener("touchmove", function (e) {
	// 	console.log('touchmove');
	// 	clearTimeout(timer);
	// 	timer = 0;
	// });
	invoiceBtn.addEventListener("touchend", function (e) {
		console.log('touchend');
		if(!checkTimer){
			recorder = lastRecorder
			alert('语音长度太短，请长按录入语音...')
		}else{
			stopRecording()
			uploadAudio()
		} 
		checkTimer = null
		clearTimeout(timer)
		return false;
	});
}


export default useInvoiceInput