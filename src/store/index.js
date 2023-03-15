import { createStore } from 'vuex'
import db from '../firebase/firebaseInit'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore'

export default createStore({
  state: {
    invoiceData: [],
    invoiceModel: null,
    modalActive: null,
    invoiceLoaded: null,
    currentInvoiceArray: null,
    editInvoice: null,
  },
  getters: {},
  mutations: {
    // toggle
    TOGGLE_INVOICE(state) {
      state.invoiceModel = !state.invoiceModel
    },
    TOGGLE_MODAL(state) {
      state.modalActive = !state.modalActive
    },
    TOGGLE_EDIT_INVOICE(state) {
      state.editInvoice = !state.editInvoice
    },

    SET_INVOICE_DATA(state, payload) {
      state.invoiceData.push(payload)
    },
    INVOICES_LOADED(state) {
      state.invoiceLoaded = true
    },
    SET_CURRENT_INVOICE(state, payload) {
      state.currentInvoiceArray = state.invoiceData.filter(
        (invoice) => invoice.invoiceId === payload
      )
    },
    DELETE_INVOICE(state, payload) {
      state.invoiceData = state.invoiceData.filter(
        (invoice) => invoice.invoiceId !== payload
      )
    },
  },
  actions: {
    async GET_INVOICES({ commit, state }) {
      const getData = collection(db, 'invoice')

      const results = await getDocs(getData)
      results.forEach((doc) => {
        if (!state.invoiceData.some((invoice) => invoice.docId === doc.id)) {
          const data = {
            docId: doc.id,
            invoiceId: doc.data().invoiceId,
            billerStreetAddress: doc.data().billerStreetAddress,
            billerCity: doc.data().billerCity,
            billerZipCode: doc.data().billerZipCode,
            billerCountry: doc.data().billerCountry,
            clientName: doc.data().clientName,
            clientEmail: doc.data().clientEmail,
            clientStreetAddress: doc.data().clientStreetAddress,
            clientCity: doc.data().clientCity,
            clientZipCode: doc.data().clientZipCode,
            clientCountry: doc.data().clientCountry,
            invoiceDateUnix: doc.data().invoiceDateUnix,
            invoiceDate: doc.data().invoiceDate,
            paymentTerms: doc.data().paymentTerms,
            paymentDueDateUnix: doc.data().paymentDueDateUnix,
            paymentDueDate: doc.data().paymentDueDate,
            productDescription: doc.data().productDescription,
            invoiceItemList: doc.data().invoiceItemList,
            invoiceTotal: doc.data().invoiceTotal,
            invoicePending: doc.data().invoicePending,
            invoiceDraft: doc.data().invoiceDraft,
            invoicePaid: doc.data().invoicePaid,
          }
          commit('SET_INVOICE_DATA', data)
        }
      })
      commit('INVOICES_LOADED')
    },
    async UPDATE_INVOICE({ commit, dispatch }, { docId, routeId }) {
      commit('DELETE_INVOICE', docId)
      await dispatch('GET_INVOICES')
      commit('TOGGLE_INVOICE')
      commit('TOGGLE_EDIT_INVOICE')
      commit('SET_INVOICE_DATA', routeId)
    },
    async DELETE_INVOICE({ commit }, docId) {
      await deleteDoc(doc(db, 'invoices', docId))
      commit('DELETE_INVOICE', docId)
    },
    async UPDATE_STATUS_TO_PAID({ commit }, docId) {
      await updateDoc(doc(db, 'invoices'), {
        invoicePaid: true,
        invoicePending: false,
      })

      commit('UPDATE_STATUS_TO_PAID', docId)
    },
    async UPDATE_STATUS_TO_PENDING({ commit }, docId) {
      await updateDoc(doc(db, 'invoices', docId), {
        invoicePaid: false,
        invoicePending: true,
        invoiceDraft: false,
      })
      commit('UPDATE_STATUS_TO_PENDING', docId)
    },
  },
  modules: {},
})
