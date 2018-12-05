import * as React from 'react'
import * as ReactDom from 'react-dom'
import { Layout, Menu, Icon, Button } from 'antd';
const { Header, Sider, Content, Footer } = Layout;
import 'antd/es/card/style/css.js';
import 'antd/es/icon/style/css.js';
import 'antd/es/layout/style/css.js';
import 'antd/es/menu/style/css.js';
import 'antd/es/button/style/css.js';
import 'antd/es/modal/style/css.js';
import 'antd/es/col/style/css.js';
import 'antd/es/row/style/css.js';
import 'antd/es/form/style/css.js';
import 'antd/es/radio/style/css.js';
import 'antd/es/input/style/css.js';
import 'antd/es/tooltip/style/css.js';
import 'antd/es/dropdown/style/css.js';
import 'antd/es/message/style/css.js';

import GoogleDrivePanel from './GoogleDrive'

interface IOptionsState {
  googleAccount: React.ReactNode;
}

class Options extends React.Component<{}, IOptionsState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      googleAccount: null
    }
  }

  googleAccountChange = (account) => {
    this.setState({ googleAccount: account })
  }

  render() {
    return (
      <Layout style={{ height: '100vh' }}>
        <Sider trigger={null} collapsible={false} >
          <div className="logo" >
            <span>Bookmark Sync</span>
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="google" />
              <span>Google Drive</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <div style={{ float: 'right' }}>
              {this.state.googleAccount}
            </div>
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            <GoogleDrivePanel onAccountChange={this.googleAccountChange} />
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            <div>Bookmark Sync @ 120 Studio</div>
            <div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" style={{ display: 'inline' }}>
                <input type="hidden" name="cmd" value="_s-xclick" />
                <input type="hidden" name="hosted_button_id" value="6R8T89JWF7WFE" />
                <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                <img alt="" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
              </form>
              <span style={{ verticalAlign: 'top' }}> $2 to support us</span>
            </div>
          </Footer>
        </Layout>
      </Layout>
    )
  }
}

ReactDom.render(
  <Options></Options>,
  document.getElementById('root')
)
