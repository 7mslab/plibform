/* plibform.js
    2021.9.24 Ver.1.0
*/

function isIe() {
  var ua = navigator.userAgent;
  return ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;
}

if(!isIe())
	var plib_params = new URLSearchParams(window.location.search);
var plib = 'plib_';

/* 任意のURLパラメータを追加 */
function plib_append(name, value){
	if(!isIe())
		plib_params.append(name,value);
}

/* URLパラメータをcookieに保存 */
// adparam: 非表示項目の定義名
function plib_save(adparam,mydomain,maxage){
  if(!isIe())
	if(plib_params.has(adparam)){
		var cookie_name = plib+adparam;
		if(!mydomain) mydomain=location.hostname;
		if(!maxage) cMaxAge=''; else cMaxAge = 'max-age='+maxage+'; ';
		document.cookie = cookie_name+'='+plib_params.get(adparam)+'; '+cMaxAge+'path=/; Domain='+mydomain;
	}
}

/* cookie に保存した値をURLパラメータに追加 */
function plib_get(adparam){
  if(!isIe())
  {
	var cookie_name = plib+adparam;
	var cookiesArray = document.cookie.split(';');
	cookiesArray.forEach(function(c){
		 var cArray = c.split('=');
		if( cArray[0].trim() == cookie_name){ 
			if(!plib_params.has(adparam)){
				plib_append(adparam,cArray[1]);
				return true;
			}
		}
	})
  }
	return false;
}

/* form を描画
// form_url: PardotフォームURL
// form_id: フォームを設置するdivのid
// max_width: フォームの最大width
// init_height: フォームの初期表示height
*/
function plib_form(form_url,form_id,max_width,init_height){

	var thisScript = document.scripts[document.scripts.length - 1];
	var pardotArea = document.getElementById(form_id);
	var pardotForm = pardotArea.getElementsByTagName('script');
	var iframe = document.createElement('iframe');

	/* iframeでフォームを描画 */
	if(!max_width)	max_width=800;
	if(!init_height)	init_height=350;
	if(!isIe())		params = '?' + plib_params.toString();
		else			params = window.location.search;
	iframe.setAttribute('src', form_url + params);
	iframe.setAttribute('class', 'pardot-iframe');
	iframe.setAttribute('width', '100%');
	iframe.setAttribute('max-width', max_width);
	iframe.setAttribute('height', init_height);
	iframe.setAttribute('type', 'text/html');
	iframe.setAttribute('frameborder', 0);
	iframe.setAttribute('allowTransparency', 'true');
	iframe.style.border = '0';

	/* heightを子オブジェクトから受け取るリスナーをセット */
	pardotForm[0].parentElement.replaceChild(iframe, pardotForm[0]);
	$(window).on('message', function(e){
		var height = e.originalEvent.data[1];
		$('.pardot-iframe').css({'height': height + 'px'});
	});

}
