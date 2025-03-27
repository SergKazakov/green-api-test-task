import axios from "axios";
import { computed, createApp, ref } from "vue/dist/vue.esm-browser.prod.js";
import "bootstrap/dist/css/bootstrap.css";

createApp({
  setup() {
    const apiUrl = ref();

    const idInstance = ref();

    const apiTokenInstance = ref();

    const response = ref();

    const sendRequest = async (path, data) => {
      try {
        const { data: d } = await axios({
          ...(data && { method: "POST", data }),
          url: `${apiUrl.value}/waInstance${idInstance.value}/${path}/${apiTokenInstance.value}`,
        });

        response.value = JSON.stringify(d, null, 2);
      } catch (error) {
        response.value = error.response?.data;
      }
    };

    const getSettings = () => sendRequest("getSettings");

    const getStateInstance = () => sendRequest("getStateInstance");

    const chatId = ref();

    const message = ref();

    const sendMessage = () =>
      sendRequest("sendMessage", {
        chatId: chatId.value,
        message: message.value,
      });

    const urlFile = ref();

    const fileName = ref();

    const sendFileByUrl = () =>
      sendRequest("sendFileByUrl", {
        chatId: chatId.value,
        urlFile: urlFile.value,
        fileName: fileName.value,
      });

    const isDisabled = computed(() => {
      const shouldDisable = !(
        apiUrl.value &&
        idInstance.value &&
        apiTokenInstance.value
      );

      return {
        getSettings: shouldDisable,
        getStateInstance: shouldDisable,
        sendMessage: shouldDisable || !(chatId.value && message.value),
        sendFileByUrl:
          shouldDisable || !(chatId.value && urlFile.value && fileName.value),
      };
    });

    return {
      apiTokenInstance,
      apiUrl,
      chatId,
      fileName,
      getSettings,
      getStateInstance,
      idInstance,
      isDisabled,
      message,
      response,
      sendFileByUrl,
      sendMessage,
      urlFile,
    };
  },
}).mount("#app");
