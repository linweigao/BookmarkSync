import * as React from 'react'
import { Col, Card, Button, Row, Icon, Tooltip } from 'antd'
import * as assign from 'object-assign'

import ChromeAuthUtil from '../../util/ChromeAuthUtil'
import GoogleApiUtil from '../../util/GoogleApiUtil'
import StorageUtil from '../../util/StorageUtil'
import DriveSync from '../../DriveSync'

import IGoogleDriveSyncOption from './SyncOption'
import GoogleDriveModal from './Modal'
import GoogleDriveSyncCard from './Card'

interface IGoogleDriveSyncSettingState {
  token?: string;
  userId?: string;
  options?: IGoogleDriveSyncOption[];
  folders?: { folderId: string, folderName: string }[];
  showModal: boolean;
}

export { IGoogleDriveSyncOption }

export default class GoogleDrivePanel extends React.PureComponent<{}, IGoogleDriveSyncSettingState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      showModal: false
    }
  }

  async componentWillMount() {
    await GoogleApiUtil.load('client')
    await GoogleApiUtil.clientLoad('drive', 'v3')
    let googleDriveSyncOptions = await StorageUtil.getGoogleDriveSyncOptions();
    googleDriveSyncOptions = googleDriveSyncOptions.filter(opt => !!opt)
    this.setState({ options: googleDriveSyncOptions })

    let token, userId
    try {
      const result = await this.loginGoogle(false)
      token = result.token
      userId = result.userId
      const rootFolder = await DriveSync.get('root')
      this.setState({ token, userId })
    }
    catch (ex) {
      if (token && ex.code === 401) {
        await ChromeAuthUtil.removeCachedAuthToken(token)
      }
    }
  }

  addSyncFolder = async () => {
    let userId = this.state.userId;
    let token = this.state.token;
    if (!token) {
      const result = await this.loginGoogle(true)
      userId = result.userId
      token = result.token
    }

    const rootFolder = await DriveSync.get('root')
    this.setState({ token, userId, showModal: true, folders: [{ folderId: rootFolder.id, folderName: rootFolder.name }] })
  }

  onAddSyncFolder = async (folderId: string, folderName: string, bookmarkName: string) => {
    const option: IGoogleDriveSyncOption = {
      userId: this.state.userId,
      folderId,
      folderName,
      bookmarkName,
      lastSyncTime: new Date()
    }
    await DriveSync.syncDrive();

    const options = this.state.options ? [...this.state.options, option] : [option];
    await StorageUtil.setGoogleDriveSyncOptions(options)
    this.setState({ options, showModal: false })
  }

  onReSyncFolder = async (option: IGoogleDriveSyncOption) => {
    const newOption = assign({}, option)
    console.log(newOption)
    await DriveSync.syncDrive();
    const options = this.state.options.map(o => {
      if (o === option) {
        return newOption
      }
    })

    console.log(options);

    await StorageUtil.setGoogleDriveSyncOptions(options)
    this.setState({ options })
  }

  onCancelSyncFolder = () => {
    this.setState({ showModal: false })
  }

  onRemoveSync = async (option: IGoogleDriveSyncOption) => {
    const options = this.state.options.slice()
    const index = options.indexOf(option)
    options.splice(index, 1)
    await StorageUtil.setGoogleDriveSyncOptions(options)
    this.setState({ options })
  }

  async loginGoogle(interactive: boolean = true) {
    const token = await ChromeAuthUtil.getAuthToken(interactive)
    const userId = await ChromeAuthUtil.getProfileUserInfo();
    GoogleApiUtil.setAuth(token)
    console.log(token, userId);
    return { token, userId }
  }

  async switchAccount() {
    await ChromeAuthUtil.revokeToken(this.state.token)
    await ChromeAuthUtil.removeCachedAuthToken(this.state.token)
    await this.loginGoogle(true)
  }

  render() {
    const cards = this.state.token && this.state.options && this.state.options.map((option, index) => {
      return (
        <Col key={index} span={8}>
          <GoogleDriveSyncCard
            key={index}
            option={option}
            onRemoveOption={this.onRemoveSync}
            onResyncOption={this.onReSyncFolder} />
        </Col>
      )
    })

    return (
      <div style={{ background: '#ECECEC', padding: '30px' }}>
        <Row gutter={16} >
          {cards}
          <Col span={8}>
            <Button type='primary' onClick={this.addSyncFolder}>Select your drive to sync</Button>
          </Col>
        </Row>
        <GoogleDriveModal
          visible={this.state.showModal}
          folders={this.state.folders}
          onSync={this.onAddSyncFolder}
          onCancel={this.onCancelSyncFolder} />
      </div>
    )
  }
}