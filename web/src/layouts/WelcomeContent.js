import React, { Component } from 'react';
import {Layout} from "antd";

const { Content } = Layout;

class WelcomeContent extends Component {
  render() {
    return (
      <Content style={{ height: '100%' }}>
        <div className="base_png" />
      </Content>
    );
  }
}

export default WelcomeContent;
