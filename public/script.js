function formHandler() {
  return {
    email: "",
    generatedCode: "",
    inputCode: "",
    isCodeVisible: false,
    isSuccess: false,
    isFail: false,
    isLoading: false,
    timer: null,
    codeValid: false,
    emailValid: null,
    modalOpen: false,
    emailSentModalOpen: false,
    prizeModalOpen: false, // Модальное окно для приза
    sendCodeModalOpen: false, // Модальное окно для отправки кода

    generateCode() {
      this.generatedCode = Math.floor(10000 + Math.random() * 90000);
      console.log("Generated code:", this.generatedCode);
    },

    validateEmail() {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      this.emailValid = emailPattern.test(this.email);
    },

    sendEmail() {
      this.validateEmail(); // Проверка email перед отправкой
      if (!this.emailValid) return; // Прерывание отправки, если email неверный

      this.isLoading = true;
      fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.email,
          code: this.generatedCode,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            this.isCodeVisible = true;
            this.emailSentModalOpen = true;
          } else {
            alert("Ошибка отправки кода.");
          }
        })
        .catch((error) => {
          console.error("Ошибка:", error);
          alert("Произошла ошибка при отправке кода.");
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    validateCode() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        console.log("Generated code:", this.generatedCode);
        console.log("User input code:", this.inputCode);

        if (this.inputCode === this.generatedCode.toString()) {
          this.codeValid = true;
          this.isSuccess = true;
          this.isFail = false;
          document.getElementById("btn-get-code").style.display = "none";
          document.getElementById("btn-correct-code").style.display = "block";
          console.log("Codes match!");
        } else {
          this.codeValid = false;
          this.isSuccess = false;
          this.isFail = true;
          document.getElementById("btn-get-code").style.display = "block";
          document.getElementById("btn-correct-code").style.display = "none";
          console.log("Codes do not match.");
        }
      }, 500);
    },

    // Открытие модального окна с призом
    openPrizeModal() {
      this.prizeModalOpen = true;
    },

    // Открытие модального окна после отправки кода
    openSendCodeModal() {
      this.sendCodeModalOpen = true;
    },
  };
}
