# plibform / Pardotフォーム拡張ライブラリ

Pardotのフォームを強化します。

- ランディングと離れたページのフォームにパラメータを引き継ぎ、フォーム送信時にPardotに値を保存することができます
- 簡単な関数でフォーム項目に任意の値を読み込みます
- URLに記載したパラメータの値もフォームの項目の値に引き渡すことができます
- フォームのサイズに合わせて描画領域の高さが伸縮し、送信ボタンが隠れるのを防ぎます


## ライブラリの読み込み

ランディングページおよびフォーム設置ページで、このライブラリを読み込んでください。
```
<script type="text/javascript" src="/[plibform.jsを保存したpath]/plibform.js"></script>
```
plibform.jsを保存したpath の部分はそれぞれ環境に適した値に置き換えてください。


## 関数

### plib_save / パラメータのcookie保存

ランディングページで呼び出します。

URLのクエリパラメータのうち、特定のパラメータ値をcookieに一時保存します。

```
plib_save('[param]','[mydomain]'{,'[max-age]'});
```
- param はURLパラメータの変数名であり、Pardotで設定したプロスペクト項目のID名を入れます。
- mydomain には、ドメインを記載します。
Pardotカスタムドメインが、サイトの親ドメインと同じ場合は、親ドメインを書いておくと共通で保存した値を使用できます。全く異なるドメインの場合は、ランディングページとフォーム設置ページ共通のドメインを記載してください。
- max-ageはオプションです。cookieの保存時間を秒単位で指定できます。
- max-age指定がない場合は、セッション保存（ブラウザが閉じられるまで）となります。

www.hoge.com/?ad_type=banner であれば、
```
plib_save('ad_type','hoge.com');
```
のように記述すると、ad_type=banner という情報をペアでcookieに保存します。
したがって、複数のパラメータを保存したい場合は、複数回この関数をコールすれば全て保存することができます。


### plib_get / パラメータの読み出し

フォーム設置ページで呼び出します。

cookieに一時保存したパラメータをフォームに引き継ぐためのパラメータに追加します。

```
plib_get('[param]');
```

### plib_append / パラメータの追加

フォーム設置ページで呼び出します。

フォーム項目に任意の値を差し込めます。

```
plib_append('[form_item_id]','[value]');
```

例えば、
```
plib_append('Email','test@mail.com');
```
のような記載もできます。（デフォルト値の読み込みのような使い方ができます）

ただ、ほとんどはカスタム項目を作り、それを非表示項目としてフォームに設置し、そこに値を埋め込む際に活躍します。

CMSで生成する動画ページやセミナーページに設置したフォームで、ページタイトルをフォームの非表示項目に入れ込んでおくと、同じフォームを使い回しつつ、どのページから送信したかを保存することができます。


### plib_form / フォームの設置

ページへフォームを設置します。
この関数だけでフォームを設置することができます。
```
<div id="[div_id]"><script ></script></div>
<script type="text/javascript">
	plib_form('[pardot_form_URL）','[div_id]',[max-width],[default-height]);
</script>
```
- pardot_form_URL は、そのまま、PardotのフォームURLです。
- div_id は任意。
- max-width はフォームの最大横幅。
- default-height はフォームの初期縦幅です。初期表示するフォームの最小幅を記載しておくと良いです。
エラーを表示するために縦幅が必要な場合は、フォームが自動で伸縮します。

ただし、伸縮を利用するためには、Pardot側のフォームデザインで、「フォーム上部」へ、ソース編集モードで下記の記述を追加してください。
```
<script type="text/javascript">
    //自動サイズ調整
    window.onload = function() {
        var height = document.getElementsByTagName("html")[0].scrollHeight;
        window.parent.postMessage(height, "*");
    }
</script>
```


フォーム設置のサンプルです。

※ここでは、noscriptの場合のiframe設置も追加

```
<div id="pardot-form" style="text-align:center;">
<script ></script>
<noscript><iframe src="[PardotフォームURL]" type="text/html" frameborder="0" allowTransparency="true" style="border: 0" class="pardot-iframe"></iframe></noscript>
</div>
<script type="text/javascript">
	plib_get('[パラメータ名]');
	plib_form('[PardotフォームURL]','pardot-form',540,350);
</script>
```

## 利用手順

1. 広告などからのランディングページのURLには、Pardotに引き渡したい項目IDの値をパラメータに加えておきます。

例： www.hoge.com/lp/?ad_type=banner

2. Pardot設定で、ad_type というプロスペクトカスタム項目IDを作成し、フォームの項目に「非表示」で加えておきます。
上記のフォームを設置したページを開きます。

例： www.hoge.com/form/contact_us/

※ただし、検証段階では「非表示」ではなく「テキスト」にしておくと確認が楽です。

この状態であれば、設置した項目に banner という文字が現れるはずです。

フォームを送信すれば、Pardot の ad_type項目に、bannerという文字列が保存されます。

## 動作可能環境

最新のモダンブラウザ

※Internet Explorerは動作対象外ですが、フォームの設置のみであれば動作します。
