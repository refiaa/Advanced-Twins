<p align='center'>
    <img src="https://capsule-render.vercel.app/api?type=waving&color=65009C&height=300&section=header&text=Advanced%20Twins&fontSize=90&animation=fadeIn&fontAlignY=38&desc=Imagine%20The%20Future.&fontColor=FFFFFF&descAlignY=51&descAlign=62"/>
</p>

<div align="center">

<!-- shields -->
[![GitHub Release Date](https://img.shields.io/github/release-date/refiaa/Advanced-Twins?style=flat-square&color=red)](https://github.com/refiaa/Advanced-Twins/releases)
[![GitHub License](https://img.shields.io/github/license/refiaa/Advanced-Twins?style=flat-square&color=orange)](https://github.com/refiaa/Advanced-Twins/blob/master/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/refiaa/Advanced-Twins?style=flat-square&color=yellow)](https://github.com/refiaa/Advanced-Twins/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/refiaa/Advanced-Twins?style=flat-square&color=green)](https://github.com/refiaa/Advanced-Twins/network/members)
[![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/refiaa/Advanced-Twins?style=flat-square&color=blue)](https://github.com/refiaa/Advanced-Twins/pulls?q=is%3Apr+is%3Aclosed)
[![GitHub closed issues](https://img.shields.io/github/issues-closed/refiaa/Advanced-Twins?style=flat-square&color=purple)](https://github.com/refiaa/Advanced-Twins/issues?q=is%3Aissue+is%3Aclosed)
<!-- end shields -->


> この UserScript は筑波大学のTwins(教育情報システム)の機能改善のために作成されました。
>
> 改善された履修登録・履修削除・kdbを利用した科目検索・シラバス確認などの機能を提供します。

<div align="left">

## 利用方法

1. Advanced-Twinsは **UserScript** を利用しています。UserScript[[1]][userscrips_faq]を管理するためにブラウザ拡張機能が必要です。
   * Chrome: [Violentmonkey][chrome_violentmonkey] or [Tampermonkey][chrome_tampermonkey]
   * Firefox: [Greasemonkey][firefox_greasemonkey], [Tampermonkey][firefox_tampermonkey], or [Violentmonkey][firefox_violentmonkey]  
   * Opera: [Tampermonkey][opera_tampermonkey]
   * Brave: [Violentmonkey][chrome_violentmonkey] or [Tampermonkey][chrome_tampermonkey]
   * Edge: [Tampermonkey][edge_tampermonkey]  
    

2. UserScriptをインストールしてください:  
  [![][greasyfork_icon]][greasyfork_url]  [![][openuserjs_icon]][openuserjs_url]  
  ・両方利用できます


3. 筑波大学 <a href="https://twins.tsukuba.ac.jp/campusweb/campusportal.do?locale=ja_JP" target="_blank">Twins</a> の履修登録ページに移動してください。


## 機能説明

### 1. 時間割に以下のような機能が追加されました

![325674844-b00f23ee-3dec-4091-917c-f53a2ee1ea59](https://github.com/refiaa/Advanced-Twins/assets/112306763/cb3ab57b-44c4-46fe-b335-6e0b22a9e4b9)
<br><図-1、Twinsの履修登録・時間割のページ>


- 履修登録のための「時間割コード」入力欄と入力ボタンが追加されました。
- 時間割内の科目のシラバス確認のためのリンクが追加されました。
- 履修削除のための✕ボタンが追加されました。

### 2. kdbへの直接接続による科目検索・履修登録機能

![325677412-a5309d8f-5321-49da-aec6-f58497d8885b](https://github.com/refiaa/Advanced-Twins/assets/112306763/e865ade5-993f-4ba4-9da2-9d5d0b63f853)
<br><図-2、kdbの学類科目の検索ページ>


![325677418-dc03147e-ccda-4d5f-a0c9-55213440450a](https://github.com/refiaa/Advanced-Twins/assets/112306763/2cce5f9d-51b3-4294-9612-9e663676b0b2)
<br><図-3、kdbの大学院科目の検索ページ>


- 左下の **kdbを開く** ボタンを押すことでkdbの検索ページが開けます。
- 学類・大学院授業の切り替えボタンを利用することで検索の転換が可能です。
- 科目検索・科目名からの検索やモジュール・授業形式による検索機能が追加されたました。
- kdbから検索した科目のシラバスの素早い確認や、kdbからの科目の追加機能が追加されました。

## Update Log

### 240416.1708
```
・Adjusted display element positioning to use relative units (viewport height and width) instead of fixed pixels.
```

### 240429.1605
```
・履修登録期限ではない科目にシラバス確認ボタンを追加できなかった問題を修正
```


----
### Any bugs？
バグを見つけたとお考えの場合は、[issue](https://github.com/refiaa/Advanced-Twins/issues)を提出してください。ただし、issueテンプレートを使用してください。

----


## ⛔️ _flowExecutionKeyを共有しないでください！⛔️ ##

_flowExecutionKeyをインターネットで共有すると、アカウントへのフルアクセスが可能になる場合があります。
誤って_flowExecutionKeyを公開した場合、**同じブラウザ**でTwinsから即座にログアウトしてください。

----
#### 免責事項

> 本データの利用によって、利用者及び第三者に生じた損害においては、権利者の故意又は過失に起因する場合を除き、権利者は責任を負わないものとします。
> 
> 権利者は特定の利用目的への適合性、第三者の権利の非侵害、瑕疵の不存在および、法令、文化、商慣習または利用過程に起因する事項の保証を行いません。
> 
> 本データの利用に関する責任はユーザーが負い、権利者を免責するものとします。
> 
> 本データの利用、または利用できなかったことにより生じた損害について、権利者は一切の責任を負いません。
> 
> 権利者が責任を負う場合であっても、権利者に故意または重過失がなく、法令で禁止される場合を除き、権利者の賠償責任は本データの提供価格を上限として直接かつ通常の損害に限られるものとします。


<!-- links -->
  [userscrips_faq]: https://ja.wikipedia.org/wiki/%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88
  [greasyfork_icon]: https://user-images.githubusercontent.com/3372598/166113712-1bc3d654-1342-4f1e-9845-21c3b21524b1.png
  [openuserjs_icon]: https://user-images.githubusercontent.com/3372598/166113714-5a2ede39-8d66-43a8-b5da-8f1897cb3121.png
  [greasyfork_moderation]: https://greasyfork.org/en/moderator_actions

  [issues]: https://github.com/refiaa/Advanced-Twins/issues
  [issues_open]: https://github.com/refiaa/Advanced-Twins/issues
  [issues_closed]: https://github.com/refiaa/Advanced-Twins/issues
  [prs]: https://github.com/refiaa/Advanced-Twins/pulls
  [pr_open]: https://github.com/refiaa/Advanced-Twins/pulls
  [prs_closed]: https://github.com/refiaa/Advanced-Twins/pulls
  [forks]: https://github.com/refiaa/Advanced-Twins/network/members

<!-- Extensions -->
  [chrome_violentmonkey]: https://chrome.google.com/webstore/detail/violent-monkey/jinjaccalgkegednnccohejagnlnfdag
  [chrome_tampermonkey]: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
  [firefox_greasemonkey]: https://addons.mozilla.org/firefox/addon/greasemonkey/
  [firefox_tampermonkey]: https://addons.mozilla.org/firefox/addon/tampermonkey/
  [firefox_violentmonkey]: https://addons.mozilla.org/firefox/addon/violentmonkey/
  [safari_tampermonkey]: https://github.com/refiaa/Advanced-Twins/issues/91#issuecomment-654514364
  [edge_tampermonkey]: https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd
  [opera_tampermonkey]: https://addons.opera.com/extensions/details/tampermonkey-beta/
  [opera_violentmonkey]: https://addons.opera.com/extensions/details/violent-monkey/

<!-- Download links -->
  [greasyfork_url]: <https://greasyfork.org/en/scripts/493478-advanced-twins-for-university-of-tsukuba> "Get Advanced-Twins from GreasyFork"
  [openuserjs_url]: <https://openuserjs.org/scripts/refiaa/Advanced_Twins_for_University_of_Tsukuba> "Get Advanced-Twins from OpenUserJS"
