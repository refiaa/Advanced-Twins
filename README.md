# Advanced-Twins

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

## 利用方法

1. Advanced-Twinsは **UserScript** を利用しています。UserScript [[1]] [userscrips_faq]を管理するためにブラウザ拡張機能が必要です。
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

<p style="border: 1px solid #000; padding: 10px; display: inline-block;">
    <img src="https://github.com/refiaa/refiaa/assets/112306763/b00f23ee-3dec-4091-917c-f53a2ee1ea59" alt="Image with Border" width="800" height="1000">
    <br><図-1、Twinsの履修登録・時間割のページ>
</p>

- 履修登録のための「時間割コード」入力欄と入力ボタンが追加されました。
- 時間割内の科目のシラバス確認のためのリンクが追加されました。
- 履修削除のための✕ボタンが追加されました。

### 2. kdbへの直接接続による科目検索・履修登録機能

<p style="border: 1px solid #000; padding: 10px; display: inline-block;">
    <img src="https://github.com/refiaa/refiaa/assets/112306763/dc03147e-ccda-4d5f-a0c9-55213440450a" alt="Image with Border" width="800" height="600">
    <br><図-2、kdbの学類科目の検索ページ>
</p>

<p style="border: 1px solid #000; padding: 10px; display: inline-block;">
    <img src="https://github.com/refiaa/refiaa/assets/112306763/a5309d8f-5321-49da-aec6-f58497d8885b" alt="Image with Border" width="800" height="600">
    <br><図-3、kdbの大学院科目の検索ページ>
</p>

- 左下の **kdbを開く** ボタンを押すことでkdbの検索ページが開けます。
- 学類・大学院授業の切り替えボタンを利用することで検索の転換が可能です。
- 科目検索・科目名からの検索やモジュール・授業形式による検索機能が追加されたました。
- kdbから検索した科目のシラバスの素早い確認や、kdbからの科目の追加機能が追加されました。


----
### Any bugs？
バグを見つけたとお考えの場合は、[issue](https://github.com/refiaa/Advanced-Twins/issues)を提出してください。ただし、issueテンプレートを使用してください。

----


## ⛔️ _flowExecutionKeyを共有しないでください！⛔️ ##

_flowExecutionKeyをインターネットで共有すると、アカウントへのフルアクセスが可能になる場合があります。
誤って_flowExecutionKeyを公開した場合、**同じブラウザ**でTwinsから即座にログアウトしてください。

----
## セキュリティ上の懸念

サードパーティのスクリプトを使用するということは、そのスクリプトの開発者が悪意のある機能をコードに挿入していないこと、および攻撃者が同様の行為をしないようにスクリプトを保護していることを信頼していることを意味します。信頼できないコードは決して実行しないでください。

----
#### 免責事項

> ソフトウェアおよびここに提供されているすべての情報は、「現状のまま」、明示的または黙示的な保証なしに提供されます。これには、商業性、特定の目的への適合性、および非侵害に関する保証が含まれますが、これに限定されません。著者または著作権所有者は、契約、侵害、またはその他の行為によるかどうかを問わず、ソフトウェアまたはその使用またはその他の取引に起因する、または関連するいかなる請求、損害、その他の責任に対しても責任を負いません。
>
> ここで提供されるコードや情報を使用することにより、上記の免責事項のすべての部分に同意することになります。


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
