

// tutorial10.js
var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function(comment) {
            return (
                <Comment owner={comment.owner} key={comment.id}>
                {comment.deck}
                </Comment>
            );
        });
        return (
            <div className="commentList">
            {commentNodes}
            </div>
        );
    }
});

// tutorial16.js
var CommentForm = React.createClass({
    getInitialState: function() {
        return {owner: '', text: ''};
    },
    handleownerChange: function(e) {
        this.setState({owner: e.target.value});
    },
    handleTextChange: function(e) {
        this.setState({text: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var owner = this.state.owner.trim();
        var text = this.state.text.trim();
        if (!text || !owner) {
            return;
        }
        this.props.onCommentSubmit({owner: owner, text: text});
        this.setState({owner: '', text: ''});
    },
    render: function() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
            <input
            type="text"
            placeholder="Your name"
            value={this.state.owner}
            onChange={this.handleownerChange}
            />
            <input
            type="text"
            placeholder="Say something..."
            value={this.state.deck}
            onChange={this.handleTextChange}
            />
            <input type="submit" value="Post" />
            </form>
        );
    }
});

// tutorial7.js
var Comment = React.createClass({
    render: function() {
        return (
            <div className="deck">
                <div className="title">
                <b>  {this.props.children} </b>
                </div>

                <div className="owner">
                {this.props.owner}
                </div>
            </div>
        );
    }
});


var Nav = React.createClass({
    render: function() {
        return (
            <a
            className="nav"
            url={this.props.url}
            onClick={this.handleClick}>{this.props.text}</a>
        );
    },
    handleClick: function(event) {
        this.props.update(this.props.url);
    },
});

// tutorial14.js
var CommentBox = React.createClass({
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.state.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.state.url, status, err.toString());
            }.bind(this)
        });
    },
    handleUpdate: function(_url) {

        $.ajax({
            url: _url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data, url: _url});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(_url, status, err.toString());
            }.bind(this)
        });
    },
    handleCommentSubmit: function(comment) {
        var comments = this.state.data;
        // Optimistically set an id on the new comment that will be replaced
        comment.id = Date.now();
        var newComments = comments.concat([comment]);
        this.setState({data: newComments, url: this.state.url});

        $.ajax({
            url: this.state.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({data: comments});
                console.error(this.state.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: [], url: "/api/comments"};
    },
    componentDidMount: function() {  // post render
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="commentBox">

                <div className="navBox">
                    <Nav text="mine" url="/api/comments" update={this.handleUpdate}/>
                    <Nav text="shared with me" url="/api/comments2" update={this.handleUpdate} />
                </div>

                <CommentList data={this.state.data} />

            </div>
        );
    }
});

ReactDOM.render(
    <CommentBox pollInterval={2000} />,
    document.getElementById('content')
);

// <CommentForm onCommentSubmit={this.handleCommentSubmit} />
