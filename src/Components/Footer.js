import React, { Component } from "react";
import Fade from "react-reveal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

class Footer extends Component {
  render() {
    if (!this.props.data) return null;

    const linkedin = this.props.data.social.linkedin;
    const github = this.props.data.social.github;
    const email = "mailto:" + this.props.data.social.email;

    return (
      <footer>
        <div className="row">
          <Fade bottom>
            <div className="twelve columns">
              <ul className="social-links">
                <li key="linkedin"><a href={linkedin}><FontAwesomeIcon icon={faLinkedin}/></a></li>
                <li key="github"><a href={github}><FontAwesomeIcon icon={faGithub}/></a></li>
                <li key="email"><a href={email}><FontAwesomeIcon icon={faEnvelope}/></a></li>
              </ul>
              <ul className="copyright">
                <li>&copy; Copyright 2021 Goh Jia Yi</li>
                <li>
                  Design by{" "}
                  <a title="Styleshout" href="http://www.styleshout.com/">
                    Styleshout
                  </a>
                </li>
              </ul>
            </div>
          </Fade>

          <div id="go-top">
            <a className="smoothscroll" title="Back to Top" href="#home">
              <i className="icon-up-open"></i>
            </a>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
