{%strip%}
{%$debug=false%}
<!DOCTYPE html>
<!--[if lt IE 7 ]>
<html class="ie6">
<![endif]-->
<!--[if IE 7 ]>
<html class="ie7">
<![endif]-->
<!--[if IE 8 ]>
<html class="ie8">
<![endif]-->
<!--[if IE 9 ]>
<html class="ie9">
<![endif]-->
<!--[if (gt IE 9)|!(IE)]>
<!-->
<html>
<!--<![endif]-->
<head>
  <meta name="renderer" content = "webkit|ie-comp|ie-stand">
  <meta charset="utf-8" />
  <meta property="wb:webmaster" content="eaa2b47c8ad0b3ee" />
  {%block "meta"%}
  {%/block%}
  <title>{%block "title"%}{%/block%}</title>
  {%block "css"%}
  {%/block%}
  <script type="text/javascript" src="http://s1.qhimg.com/static/1c44f7af3eca2a0d/jquery-1.9.1.js"></script>
  <!--[if lte IE 7]>
  <script type="text/javascript" src="http://s0.qhimg.com/!af7b0482/json3.js"></script>
  <![endif]--> 
</head>
<body>
  {%include file='../../public-resource/components/header/index.tpl'%}
  <div id="wrapper">
    <div class="wrapper-inner">
    {%block "container"%}
    {%/block%}
    </div>
  </div>
  {%include file='../../public-resource/components/footer/index.tpl'%}
  {%block "js"%}
  {%/block%}
</body>
</html>
{%/strip%}

{%if isset($smarty.get._debug) && $smarty.get._debug%}
  {%debug%}
{%/if%}
