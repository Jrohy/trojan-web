const Mixins = import.meta.globEager("./svg/*.svg")
export default {
    mixins: Object.values(Mixins).map((v) => v.default)
}
