
/* 
 * Blogger Comment Toggle
 *
 * Author: Cornelius (c9s)
 * Email:  cornelius.howl@DELETE_ME.gmail.com 
 * Web:    http://oulixe.us/
 * Blog:   http://c9s.blogspot.com/
 * Github: http://github.com/c9s
 * 
 * c9s@twitter.com
 * c9s@plurk.com
 *
 *
 * Usage:
 *
 *    add a html/javascript widget in your blogger template
 *    put the below html:
 *
 *      <script type="text/javascript" src="http://github.com/c9s/blogger-comment.js/raw/master/blogger-comment.js"></script>
 *
 */
;
function append_css()
{
    var content = '<style type="text/css">'
            + '.comment-appended { margin: 30px; } '
            + '.comment-entry   { margin-top: 30px; border-top:1px solid #ccc; } '
            + '.comment-content { margin:6px 10px; } '
            + '.comment-author { margin-left: 50px; } '
            + '.comment-published { margin-left: 60px;  } '
            + 'a.comment-new-link { display:block; text-align:right; text-decoration:underline; width:90%; } '
            + '</script>';
    $(document.body).append( content );
}

function gen_template(blogId,postId,json)
{
    var html = '<div class="comment-appended" id="comment-appended-'+postId+'">';
    json.feed.entry.reverse();
    for( var i=0; i < json.feed.entry.length ; i++ ) {
        var e = json.feed.entry[i];
        html += '<div class="comment-entry">';
        html += '<div class="comment-content">' + e.content.$t + '</div>';
        html += '<div class="comment-author">' 
                + '<b>(author `' + e.author[0].name.$t + '\')</b> '
                + ' (web `<a href="' + e.author[0].uri.$t + '">' + e.author[0].uri.$t + '\'</a>)'
                + '<i>(email `' +e.author[0].email.$t + '\')</i>'
                + '</div>';
        html += '<div class="comment-published">' + e.published.$t + '</div>';

        html += '</div>';
    }
    html += '</div>';
    html += '<a class="comment-new-link" href="https://www.blogger.com/comment.g?'
                + 'blogID='+blogId 
                + '&postID='+postId+'">Post Comment</a>';
    return html;
}

//curl 'http://www.blogger.com/feeds/3147036244016021082/8413271979129208960/comments/default?alt=json'
function retrieve_comments(postId,hook) {
    $.ajax({ 
        url: '/feeds/'+postId+'/comments/default?alt=json',
        type: 'GET',
        complete: function(response) {
            var json; eval("json="+response.responseText);
            hook(json);
    }});
}

function match_link(o) {
    var m; 
    return ( m = o.href.match( /blogID=(\d+)\&postID=(\d+)/ ) ) 
         ? { blogId: m[1] , postId: m[2] }
         : 0 ;
}

$(document.body).ready(function(){
    $('a.comment-link').click(function(e){
        var d, t = e.target;
        if( d = match_link(t) ) {
            var f = $(t).parent().parent().find('div#comment-appended-' + d.postId);
            ( f[0] ) 
                ? f.toggle('slide')
                : retrieve_comments( d.postId,function(json) {
                        $(t).parent().parent().append(
                            gen_template( d.blogId, d.postId , json )
                        ); });
        }
        return false;
    });
    append_css();
});

