<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Clueless</title>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <!-- <link rel="shortcut icon" href="/util/flat-ui/images/favicon.ico"> -->
        <link rel="shortcut icon" href="http://www.clueless.sg/util/flat-ui/images/favicon.ico?v=2" />
        <link rel="stylesheet" href="/util/flat-ui/bootstrap/css/bootstrap.css">
        <link rel="stylesheet" href="/util/flat-ui/css/flat-ui.css">
        <link rel="stylesheet" href="/css/key-words.css">
        <!-- Using only with Flat-UI (free)-->
        <link rel="stylesheet" href="/util/common-files/css/icon-font.css">
        <!-- end -->
        <link rel="stylesheet" href="css/style.css">
    </head>
    <body>
        <div id="fb-root"></div>
        <script>
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=326937914152431&version=v2.0";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        </script>
        <div class="page-wrapper">
            <!-- header-11 -->
            <!-- <header class="header-11" style="margin-top:20px">
                <div class="container">
                    <div class="row">
                        <div class="navbar col-sm-16" style="display: inline-block;list-style-type: none;">
                            <div class="navbar-header">
                                <a class="brand" href="#"><img src="img/logo@2x.png" width="50" height="50" alt=""> Clueless</a>
                                 <a class="navbar-brand" ><img src="logo.png" height="100" alt="" style="margin-left:-10px"></a>
                                 <div class="navbar-brand"><center><a href="#"><div class="headerfont">Clueless</div></a></center></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header> -->
            <section class="header-11-sub bg-danger">
                <div class="container">
                <center><div class="headerfont" style="margin-top:-30x">Clueless</div></center>
                        <!-- <br/>
                        <button class="btn" id="nin">Animate</button><br /> -->
                       <div id="svg-container" style="margin-left:-100px;margin-right:-100px">
                          <svg id="svgC" width="100%" height="100%" viewBox=" 40 -135 520 148" preserveAspectRatio="xMidYMid meet"></svg>  
                        </div>
                    <div class="row">
                        <div class="col-sm-12">
                        <center>
                        <section class="rw-wrapper"><center>
                            <h3 class="rw-sentence"><span>Are you clueless about your</span>
                            <br/><br/>
                            <div class="rw-words rw-words-1" >
                                <span>life?</span>
                                <span>career?</span>
                                <span>future?</span>
                            </div></h3>
                            </center></section> 
                            <h3 style="max-width:800px">
                                You have the dream. You've done the work.<br/> We just create the opportunities.<br/><br/>
                                <p style="color:white;font-size:20px">We don't discriminate by Year of Study or Faculty. Infact, we love the young and adventurous!
                                So if you want to try out new industries that <span class="key_words"> aren't related to your faculty </span> or you think that you're too underqualified because you're in <span class="key_words">year 1 or 2 </span>, trust me, this is the place for you. <span><br/><br/><b>We'll help you potentially get the career of your dreams through internships and opportunities. </b><br/><span>All you have to do is let us, and enter your email below!</span><br/></p>
                            </h3>
                            <?php require('./check_submit.php') ?> 
                            <div class="signup-form">
                                 <form action="" method="post">
                                 <div class="input-group" style="max-width:800px">
                                        <input class="form-control" type="email" name="email" id="email" placeholder="Your E-mail"><span class="input-group-btn"><button name="submit" id="submit" type="submit" style="margin-top: -0px;" class="btn btn-default">Sign Up</button></span>
                                    </div>
                                    <label name="feedback" id="feedback"><?php echo $msg ?></label>
                                </form>
                             </div>
                             <div class="additional-links"></a><br/> © Clueless 2014</div> 
                             <div class="fb-like" data-href="https://www.facebook.com/pages/Clueless/265569870307212" data-layout="button_count" data-action="like" data-show-faces="true" data-share="true"></div>
                        </div>
                    </div>
                </div>
            </section>
            </div>

        <!-- Placed at the end of the document so the pages load faster -->
        <script src="/util/common-files/js/jquery-2.1.1.min.js"></script>
        <script src="/util/flat-ui/js/bootstrap.min.js"></script>
        <script src="/js/snap.svg-min.js"></script>
        <script src="/js/script.js"></script>
        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

          ga('create', 'UA-54318152-1', 'auto');
          ga('send', 'pageview');

        </script>
    </body>
</html>