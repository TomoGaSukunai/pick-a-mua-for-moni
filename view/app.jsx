const React = require('react')
const Component = React.Component
const ReactDOM = require('react-dom')

import { Button, Alert } from "@blueprintjs/core"


const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const getImgAsDataURLAsync = (url, callback) => {
    const fileReader = new FileReader()
    fileReader.onload = callback
    fetch(url).then(res => res.blob()).then(x => fileReader.readAsDataURL(x))
}

class Members extends Component {
    state = {
        list: [],
        chosen: -1,
        isOpen: false,
        isLoading: false,
        loadingText: ""
    }
    refreshMember = async () => {
        this.setState({ isLoading: true, loadingText: "获取基本信息" })
        const url = new URL("https://api.live.bilibili.com/xlive/app-room/v2/guardTab/topList")
        let page = 1;
        url.search = new URLSearchParams({
            roomid: 23001181,
            page: page,
            page_size: 29,
            ruid: 1589117610

        })
        let data = await fetch(url).then(res => res.json())
        const pages = data.data.info.page
        const list = []

        const pushAndCheck = data => {
            for (const mem of data) {
                list.push(mem)
                if (!localStorage[mem.face]) {
                    getImgAsDataURLAsync(mem.face, e => {
                        localStorage[mem.face] = e.target.result
                        this.forceUpdate()
                    })
                }
            }
        }

        pushAndCheck(data.data.top3)

        pushAndCheck(data.data.list)

        while (page < pages) {
            url.searchParams.set("page", ++page)
            this.setState({ loadingText: `获取舰长信息 ${page}/${pages}` })

            data = await fetch(url).then(res => res.json())
            pushAndCheck(data.data.list)
        }

        this.setState({ loadingText: `完成` })
        await sleep(100)
        // console.log(list)
        this.setState({ list, isLoading: false })
    }
    pickAMemmber = () => {
        let chosen = -1
        // black box
        // if (Math.random() > 0.5) {
        //     this.state.list.forEach(mem => { if (mem.uid == 420219) chosen = mem.rank - 1 })
        // }
        if (chosen == -1) {
            chosen = Math.floor(this.state.list.length * Math.random())
        }
        this.setState({ isOpen: true, chosen })
    }
    handleConfirm = () => {
        this.setState({ isOpen: false })
    }
    render() {


        const picked = this.state.list[this.state.chosen];
        const { rank, username, face } = picked || {}
        return (
            <div style={{ height: "100%" }}>
                <div className="member-list">
                    {this.state.list.map(mem => {
                        const { rank, username, face } = mem
                        return (<div key={rank} >
                            <span className="list-rank">{rank}</span>
                            <span><img src={localStorage[face]} /></span>
                            <span>{username}</span>
                        </div>)
                    })}
                </div>
                <Button
                    icon="refresh"
                    onClick={this.refreshMember}
                    intent="success"
                    text="获取舰长列表" />
                <Button
                    icon="heart"
                    onClick={this.pickAMemmber}
                    intent="danger"
                    text="随机抽一个MUA" />

                <Alert
                    intent="primary"
                    icon="refresh"
                    isLoading={true}
                    isOpen={this.state.isLoading}
                >
                    <div>
                        <span>{this.state.loadingText}</span>
                    </div>
                </Alert>

                <Alert
                    cancelButtonText="不在"
                    confirmButtonText="MUA"
                    icon="heart"
                    intent="danger"
                    isOpen={this.state.isOpen}
                    onConfirm={this.handleConfirm}
                    onCancel={this.handleConfirm}
                >

                    <div className="member-list" style={{
                        width: "100%",
                        height: "100%",
                        overflowY: "hidden",
                        textAlign: "center",
                        padding: "10px"
                    }}>
                        <span>{rank}</span>
                        <br></br>
                        <span>
                            <img className="big-icon" src={localStorage[face]} />
                        </span>
                        <br></br>
                        <span className="mua-text">{username}</span>
                    </div>

                </Alert>
            </div>
        )
    }
}

ReactDOM.render(
    <Members />,
    document.querySelector("#pick-a-mua")
)