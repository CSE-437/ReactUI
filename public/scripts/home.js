

// tutorial10.js
var DeckList = React.createClass({
    render: function() {
        var deckNodes = this.props.data.map(function(deck) {
            return (
                // <Deck
                // key = {deck.name}
                // name = {deck.name}
                // desc = {deck.desc}
                // owner={deck.owner}
                // cids = {deck.cids}
                // children = {deck.children}
                // subscribers = {deck.subscribers}
                // >
                <Deck
                did = {deck.did}
                name = {deck.name}
                keywords = {deck.keywords}
                desc = {deck.desc}
                //cids = {deck.cids}
                newCards = {deck.newCards}
                owner ={deck.owner}
                ispublic = {deck.ispublic}
                children = {deck.children}
                subscribers = {deck.subscribers}
                >
                </Deck>
            );
        });
        return (
            <div className="commentList">
            {deckNodes}
            </div>
        );
    }
});

// tutorial16.js
var DeckForm = React.createClass({
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
var Deck = React.createClass({
    render: function() {
        return (
            <div className="deck">
                // <div className="name">
                // {this.props.name}
                // </div>
                //
                // <div className="description">
                // {this.props.desc}
                // </div>
                //
                // <div className="owner">
                // Owner: {this.props.owner}
                // </div>
                //
                // <div className="cids">
                // {this.props.cids.length} cards
                // </div>
                //
                // <div className="children">
                // {this.props.children.length} subdecks
                // </div>
                <div className="name">
                Name: {this.props.name}
                </div>

                <div className="description">
                {this.props.desc}
                </div>

                <div className="children">
                {this.props.children.length} subdecks
                </div>

                <div className="owner">
                Owner: {this.props.owner}
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
var DeckBox = React.createClass({
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
        return {data: [], url: "http://ankihub.herokuapp.com/api/decks/fluffluff:1455903505170"};
    },
    componentDidMount: function() {  // post render
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="commentBox">

                

                <DeckList data={this.state.data} />

            </div>
        );
    }
});

ReactDOM.render(
    <DeckBox pollInterval={2000} />,
    document.getElementById('content')
);

// <DeckForm onCommentSubmit={this.handleCommentSubmit} />
