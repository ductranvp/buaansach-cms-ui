<template>
    <el-container v-loading="!ready" class="full-size" direction="horizontal">
        <el-aside width="450px" class="aside">
            <pos-machine-sidebar v-loading="currentStore.storeStatus ==='CLOSED' || isLoadingOrder"/>
        </el-aside>
        <el-container class="full-size" direction="vertical">
            <pos-machine-header/>
            <pos-machine-main v-loading="currentStore.storeStatus ==='CLOSED'" class="hidden-sm-and-down"/>
        </el-container>
    </el-container>
</template>

<script>
    import PosMachineSidebar from "@/views/private/pos-machine/PosMachineSidebar";
    import PosMachineHeader from "@/views/private/pos-machine/PosMachineHeader";
    import PosMachineMain from "@/views/private/pos-machine/PosMachineMain";
    import {mapState} from "vuex";
    import PosWebsocket from "@/views/layout/pos-machine/pos.websocket";

    export default {
        name: "PosMachineLayout",
        components: {PosMachineMain, PosMachineHeader, PosMachineSidebar},
        mixins: [PosWebsocket],
        computed: {
            ...mapState({
                ready: state => state.posMachine.ready,
                currentStore: state => state.posMachine.currentStore,
                isLoadingOrder: state => state.posMachine.isLoadingOrder,
            })
        },
        data() {
            return {askBeforeLeave: false};
        },
        mounted() {
            if (this.askBeforeLeave) {
                window.onbeforeunload = function (event) {
                    event.returnValue = "ask before leave";
                };
            }
        },
        beforeDestroy() {
            window.onbeforeunload = null;
            this.$store.commit("posMachine/SET_STORE_NOTIFICATIONS", []);
            this.$store.dispatch("posMachine/clearSeat");
        },
        async created() {
            await this.$store.dispatch("posMachine/initState", this.$route.params.storeGuid);
            await this.$store.dispatch("posMachine/getStoreNotification", this.$route.params.storeGuid);
        }
    };
</script>

<style scoped>
    .pos-container,
    .pos-main-container {
        height: 100%;
    }

    .aside {
        background-color: #fff;
        overflow: hidden;
    }
</style>
