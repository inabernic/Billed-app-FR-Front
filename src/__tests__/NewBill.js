/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import mockStore from "../__mocks__/store"
import { bill } from "../fixtures/bills.js"
import BillsUI from "../views/BillsUI.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then when i click the submit button , the submit shoud be handled", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const user = {
        type: "Employee",
        email: "employee@test.com",
        password: "employee",
        status: "connected"
      }
      window.localStorage.setItem("user", JSON.stringify(user))
      const mockStore = null
      const mockBill = new NewBill({ document, onNavigate, mockStore, localStorage })
      const formNewBill = document.querySelector(`form[data-testid="form-new-bill"]`)
      const inputCont = document.querySelector(`form[data-testid="form-new-bill"]`)
      const handleSubmit = jest.fn((e = { target: inputCont }) => mockBill.handleSubmit(e))
      formNewBill.addEventListener("submit", handleSubmit)
      $(formNewBill).trigger("submit", handleSubmit)
      expect(handleSubmit).toHaveBeenCalled
    })

    test("Then when i import a file it should run the handleChangeFile function ", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const mockBill = new NewBill({ document, onNavigate, mockStore, localStorage })
      const file = document.querySelector(`input[data-testid="file"]`)
      const handleChangeFile = jest.fn((e = { target: file }) => mockBill.handleChangeFile(e))
      file.addEventListener("click", handleChangeFile)
      $(file).trigger("click", handleChangeFile)
      expect(handleChangeFile).toHaveBeenCalledTimes(1)
    })

    // test post
    test("fetches bills from mock API POST", async () => {
      //jest.spyOn(object, methodName)
      const getSpy = jest.spyOn(bills, "post")
      const bills = await bills.post()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(4)
    })

    test("fetches bills from an API and fails with 404 message error", async () => {
      //When the mocked function lacks implementations set with .mockImplementationOnce(), it will run the default implementation set with jest.fn(() => defaultValue) or .mockImplementation(() => defaultValue) if they have been called 
      mockStore.bills.create.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {
      bill.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})

