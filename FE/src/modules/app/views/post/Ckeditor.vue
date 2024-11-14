<template>
  <div style="width: 100%;">
    <div ref="editorContainer"></div>
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  name: 'CkEditor',
  props: {
    modelValue: String, // Sử dụng để nhận giá trị từ parent component (Vue 3 với v-model)
    type: null
  },
  emits: ['update:modelValue'],
  mounted() {
    ClassicEditor.create(this.$refs.editorContainer, {
      ckfinder: {
        uploadUrl: `${import.meta.env.VITE_API_URL}/products/upload`
      }
    })
      .then(editor => {
        this.editor = editor;

        this.editor.setData(this.modelValue);
        // Lắng nghe sự kiện thay đổi dữ liệu
        editor.model.document.on('change:data', () => {
          setTimeout(() => {
            this.$emit('update:modelValue', editor.getData());
          }, 100);
        });
      })
      .catch(error => {
        console.error('Lỗi khi khởi tạo CKEditor:', error);
      });
  },
  beforeUnmount() {
    if (this.editor) {
      this.editor.destroy().catch(error => console.error('Lỗi khi hủy CKEditor:', error));
    }
  },
  watch: {
    modelValue(newValue) {
      if (this.editor) {
        if (newValue === "") {
          this.editor.setData("");
        }
      }
    },
  },
};
</script>
