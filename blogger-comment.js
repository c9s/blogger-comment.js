
;

function setup_css()
{
    var content = '<style type="text/css">'
            + '.comment-appended { margin: 30px; } '
            + '.comment-entry   { margin-top: 30px; border-top:1px solid #ccc; } '
            + '.comment-content { margin:6px 10px; } '
            + '.comment-author { margin-left: 50px; } '
            + '.comment-published { margin-left: 60px;  } '
            + '</script>';
    jQuery(document.body).append( content );
}


function gen_template(blogId,postId,json)
{
    var title = json.feed.title;
    var author = json.author;
    var entry = json.feed.entry;
    var html = '';
    html += '<div class="comment-appended" id="comment-appended-'+postId+'">';
    for( var i=0; i < entry.length ; i++ ) {
        var e = entry[i];
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
    return html;
}

function get_comments(blogId,postId,hook) {
    //curl 'http://www.blogger.com/feeds/3147036244016021082/8413271979129208960/comments/default?alt=json'
    $.ajax({ 
        url: '/feeds/'+postId+'/comments/default?alt=json',
        type: 'GET',
        complete: function(response) {
            var json; 
            eval("json="+response.responseText);
            hook(json);
    }});
}

//$(document).ready(function(){
    $('a.comment-link').click(function(e){
        var t = e.target;
        var link = t.href;
        var m;
        if( m = link.match( /blogID=(\d+)\&postID=(\d+)/ ) ) {
            var blogId = m[1]; var postId = m[2];
            var f = $(t).parent().find('div#comment-appended-' + postId);
            ( f[0] ) 
                ? f.toggle('slide')
                : get_comments(blogId,postId,function(json) {
                    var html = gen_template( blogId, postId , json )
                    $(t).parent().append( html ); });
        }
        return false;
    });

    setup_css();
//});
