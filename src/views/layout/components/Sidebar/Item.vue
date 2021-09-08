<script>
export default {
    name: 'MenuItem',
    functional: true,
    props: {
        icon: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        }
    },
    render() {
        const vnodes = []

        if (this.icon) {
            vnodes.push(<svg-icon icon-class={this.icon}/>)
        }

        if (this.title) {
            vnodes.push(<span slot='title'>{(this.title)}</span>)
        }
        return vnodes
    }
}
</script>
