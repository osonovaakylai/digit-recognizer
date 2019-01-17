import React, {Component} from 'react';

class Header extends Component {
    render() {
        return (
            <nav className="navbar navbar-inverse col-md-10 col-md-offset-1">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"/>
                            <span className="icon-bar"/>
                            <span className="icon-bar"/>
                        </button>
                        <a className="navbar-brand" href="#">Digit Recognizer</a>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            <li className="active"><a href="#">Home</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Header;