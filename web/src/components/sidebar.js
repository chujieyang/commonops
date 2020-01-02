import React, {Component} from 'react';
import { Layout, Menu, Icon, message } from 'antd';
import { Link } from 'react-router-dom';
import Menus from "../menu";
import {getUserPermissionsList} from "../api/permission";

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class OpsSider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authList: []
        }
    }

    componentWillMount() {
        getUserPermissionsList().then((res)=>{
            if(res.code === 0) {
                const dataList = res.data;
                let permissionUrlList = [];
                dataList.map((item)=>{
                    return permissionUrlList.push(item.urlPath);
                });
                this.setState({
                    authList: permissionUrlList
                })
            } else {
                message.error("获取用户菜单权限异常")
            }
        }).catch((err)=>{
            message.error(err.toLocaleString())
        })
    }

    hasSubMenusAllowed(subMenuList) {
        let result = false;
        subMenuList.map((item)=>{
            if(this.state.authList.indexOf(item.route) > -1 || Menus.noAuthMenus.indexOf(item.route) > -1){
                result = true;
                return result;
            } else {
                return null;
            }
        });
        return result;
    }

    hasMenuAllowed(menuUrlPath) {
        return this.state.authList.indexOf(menuUrlPath) > -1 || Menus.noAuthMenus.indexOf(menuUrlPath) > -1;
    }

    render() {
        return (
            <Sider
                collapsed={this.props.menuCollapsed}
                style={{ textAlign: 'center' }}
            >
                <span className="logo" style={this.props.menuCollapsed?{backgroundSize:'80%'}:{backgroundSize:'80%'}}/>
                <span className="logo-text" style={this.props.menuCollapsed?{display:'none'}:{}}>运维平台</span>
                <Menu theme="dark"
                    mode="inline"
                    className="introStep4"
                    style={{ textAlign: 'left' }}
                >
                  {
                      Menus.sideMenus.map((menu) => {
                          if(menu.subMenus.length && this.hasSubMenusAllowed(menu.subMenus)){
                              return (
                                  <SubMenu
                                      key={menu.menuTitle}
                                      title={<span><Icon type={menu.icon} /><span>{menu.menuTitle}</span></span>}
                                  >
                                      {
                                          menu.subMenus.map((subMenu) => {
                                              if(this.hasMenuAllowed(subMenu.route)){
                                                  return (
                                                      <Menu.Item key={subMenu.title}>
                                                          <Link to={subMenu.route}>{subMenu.title}</Link>
                                                      </Menu.Item>
                                                  )
                                              } else {
                                                  return null;
                                              }
                                          })
                                      }
                                  </SubMenu>
                              )
                          } else {
                              return null
                          }
                      })
                  }
                </Menu>
            </Sider>
        )
    }
}

export default OpsSider;
