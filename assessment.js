'use strict'
const userNameInput = document.getElementById('user-name');
const assessmentButton = document.getElementById('assessment');
const resultDivided = document.getElementById('result-area');
const tweetDivided = document.getElementById('tweet-area');

/**
 * 指定した要素の子どもを全て削除する
 * @param {HTMLElement} element HTMLの要素
*/
function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

//マウスが乗った時に診断するボタンを透明にする(テキスト外)
assessmentButton.addEventListener('mouseover', () => {
  assessmentButton.style.opacity = 0.7;
});

//マウスが外れた時にもとに戻す
assessmentButton.addEventListener('mouseleave', () => {
  assessmentButton.style.opacity = '';
});

//診断するボタンを推したときの処理
assessmentButton.onclick = () => {
    const userName = userNameInput.value;
    //入力されていなかったらアラートを出す（テキスト外）
    if (userName.length === 0) {
      alert('名前が入力されていません。');
      return;
    }

    //入力欄を空にする（テキスト外）
    userNameInput.value='';

    //文字列型以外だったらエラーにしようとしたができなかった
    // if (typeof (userName) !== 'string') {
    //   alert('正しい名前を入力してください')
    // }

    // ----------診断結果表示エリアの作成------------
    //連続して結果が表示されないようにする関数の実行クリックされた瞬間に消したいからこの位置（一番初め）で実行する
    removeAllChildren(resultDivided);

    //createElement:新しいタグを作る
    //document.createElement を使うと、まず <p></p> や <h3></h3> のような要素を作成し、
    //後から innerText プロパティを用いてタグの中身を設定できる。
    const header = document.createElement('h3');
    header.innerText = '診断結果';

    //div 要素 の子要素として p タグを追加（appendChild）。
    resultDivided.appendChild(header);

    const paragraph = document.createElement('p');
    const result = assessment(userName);
    paragraph.innerText = result;
    resultDivided.appendChild(paragraph);

    // -------------createElementの使い方の実験----------innerTextまでだと、<h1>こんにちは</h1>がコンソールには出るが画面にはでない
    // appendChildとセットで使うと出る（一番下にでた）
    // const test =document.createElement('h1');
    // test.innerText='こんにちは';
    // console.log(test);
    // resultDivided.appendChild(test)

    //連続して診断結果が出てしまわないようにする。
    //ボタンを推せなくなるようにするだけならこれでいける。本当はwhile文で制御する
    //assessmentButton.disabled =true;

    //練習ok
    // const test = document.createElement('p');
    // test.innerText = 'テスト';
    // tweetDivided.appendChild(test);
    // removeAllChildren(tweetDivided);

    //----------- ツイートエリアの作成-------------------
    removeAllChildren(tweetDivided);
    const anchor = document.createElement('a');
    const hrefValue =
      'https://twitter.com/intent/tweet?button_hashtag=' + encodeURIComponent('あなたのいいところ') + '&ref_src=twsrc%5Etfw';

    //setAttribute：新しい属性の追加(属性,値)
    anchor.setAttribute('href', hrefValue);

    anchor.className = 'twitter-hashtag-button';
    // 上のコードと同義
    // anchor.setAttribute('class','twitter-hashtag-button');

    anchor.setAttribute('data-text', result);
    anchor.innerText = 'Tweet #あなたのいいところ';
    tweetDivided.appendChild(anchor);

    //-------------widgets.js の設定------------
    const script = document.createElement('script');
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    tweetDivided.appendChild(script);
}

//テキストフィールドでEnterキーをおしたときも診断ボタンが押されたときと同じ処理をする
userNameInput.onkeydown = event => {
  if (event.key === 'Enter') {
    // ボタンのonclick() 処理を呼び出す
    assessmentButton.onclick();
  }
};

//診断結果の配列
const answers = [
  '{userName}のいいところは声です。{userName}の特徴的な声は皆を惹きつけ、心に残ります。',
  '{userName}のいいところはまなざしです。{userName}に見つめられた人は、気になって仕方がないでしょう。',
  '{userName}のいいところは情熱です。{userName}の情熱に周りの人は感化されます。',
  '{userName}のいいところは厳しさです。{userName}の厳しさがものごとをいつも成功に導きます。',
  '{userName}のいいところは知識です。博識な{userName}を多くの人が頼りにしています。',
  '{userName}のいいところはユニークさです。{userName}だけのその特徴が皆を楽しくさせます。',
  '{userName}のいいところは用心深さです。{userName}の洞察に、多くの人が助けられます。',
  '{userName}のいいところは見た目です。内側から溢れ出る{userName}の良さに皆が気を惹かれます。',
  '{userName}のいいところは決断力です。{userName}がする決断にいつも助けられる人がいます。',
  '{userName}のいいところは思いやりです。{userName}に気をかけてもらった多くの人が感謝しています。',
  '{userName}のいいところは感受性です。{userName}が感じたことに皆が共感し、わかりあうことができます。',
  '{userName}のいいところは節度です。強引すぎない{userName}の考えに皆が感謝しています。',
  '{userName}のいいところは好奇心です。新しいことに向かっていく{userName}の心構えが多くの人に魅力的に映ります。',
  '{userName}のいいところは気配りです。{userName}の配慮が多くの人を救っています。',
  '{userName}のいいところはその全てです。ありのままの{userName}自身がいいところなのです。',
  '{userName}のいいところは自制心です。やばいと思ったときにしっかりと衝動を抑えられる{userName}が皆から評価されています。',
]

/**
 * 名前の文字列を渡すと診断結果を返す関数
 * @param {string} userName ユーザーの名前
 * @return {string} 診断結果
 */

function assessment(userName) {
  // 全文字のコード番号を取得してそれを足し合わせる
  let sumOfCharCode = 0;
  for (let i = 0; i < userName.length; i++) {
    sumOfCharCode = sumOfCharCode + userName.charCodeAt(i);
  }

  // 文字のコード番号の合計を回答の数で割って添字の数値を求める
  const index = sumOfCharCode % answers.length;
  let result = answers[index];

  // {userName} をユーザーの名前に置き換える
  result = result.replaceAll('{userName}', userName);
  return result;
}


//---------テストする関数------------
//「太郎」の結果が正しいかのテスト
console.assert(
  assessment('太郎') ===
  '太郎のいいところは決断力です。太郎がする決断にいつも助けられる人がいます。',
  '診断結果の文言の特定の部分を名前に置き換える処理が正しくありません。'

)
//入力した名前が同じだったら同じ診断結果を返すテスト
console.assert(
  assessment('太郎') === assessment('太郎'),//ここまでが１引数
  '入力が同じ名前なら、同じ診断結果を出力する処理が正しくありません。'
)
