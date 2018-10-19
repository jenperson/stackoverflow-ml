const request = require('request');
//let testquestion = "<p>A recent <a href=http://ajaxian.com/archives/swipe-flip-iphone rel=nofollow noreferrer>Ajaxian post title Swipe away then quickly flip with simple jQuery plugins</a> tells us about flip events on the iPhone Safari browser and I wanted to use them on another webkit browser the Android Browser. </p>  <pre><code>$('.swipe').swipe({       swipeLeft: function() { $('#someDiv').fadeIn() }       swipeRight: function() { $('#someDiv').fadeOut() }  }) </code></pre>  <p>The event is triggered but it still scrolls the page left and right. Anyone know a work around for this? I'd love to see the plugin get whatever fix is possible so it works in more places of course.</p> "
let testquestion = "<p>I've been working on Android SDK platform and it is a little unclear how to save an application's state. So given this minor re-tooling of the 'Hello Android' example:</p>  <pre><code>package com.android.hello;  import android.app.Activity; import android.os.Bundle; import android.widget.TextView;  public class HelloAndroid extends Activity {    private TextView mTextView = null;    /** Called when the activity is first created. */   @Override   public void onCreate(Bundle savedInstanceState) {     super.onCreate(savedInstanceState);      mTextView = new TextView(this);      if (savedInstanceState == null) {        mTextView.setText(Welcome to HelloAndroid!);     } else {        mTextView.setText(Welcome back.);     }      setContentView(mTextView);   } } </code></pre>  <p>I thought it would be enough for the simplest case but it always responds with the first message no matter how I navigate away from the app.</p>  <p>I'm sure the solution is as simple as overriding <code>onPause</code> or something like that but I've been poking away in the documentation for 30 minutes or so and haven't found anything obvious.</p> ";
makeTestRequest();

function makeTestRequest() {
  testquestion = encodeURIComponent(testquestion)
  request(`https://us-central1-automl-and-firebase.cloudfunctions.net/stackoverflow-manual?text=${testquestion}`, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); 
    // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
  });
}


