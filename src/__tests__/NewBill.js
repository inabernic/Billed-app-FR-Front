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

import router from "../app/Router";
import { localStorageMock } from "../__mocks__/localStorage";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.appendChild(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
    })


    test("Then when i click the submit button , the submit shoud be handled", () => {
      document.body.innerHTML = NewBillUI()
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



    // test post whith the function update
    test("fetches bills from mock API POST", async () => {
      const getSpy = jest.spyOn(mockStore, 'bills')
      const newBill = {
        "id": "47qAXb6fIm2zOKkLzMro",
        "vat": "80",
        "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        "status": "pending",
        "type": "Hôtel et logement",
        "commentary": "séminaire billed",
        "name": "encore",
        "fileName": "preview-facture-free-201801-pdf-1.jpg",
        "date": "2004-04-04",
        "amount": 400,
        "commentAdmin": "ok",
        "email": "a@a",
        "pct": 20
      };
      const postBills = await mockStore.bills().update(newBill)
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(postBills).toStrictEqual(newBill)
    })

    //the 404 error indicates that the requested resource, usually a web page, was not found. It is often accompanied by a message with the words "not found".
    test("fetches bills from an API and fails with 404 message error", async () => {
      //When the mocked function lacks implementations set with .mockImplementationOnce(), it will run the default implementation set with jest.fn(() => defaultValue) or .mockImplementation(() => defaultValue) if they have been called 
      document.body.innerHTML = BillsUI({ error: "Erreur 404" })
      mockStore.bills.mockImplementationOnce(() => {
        return {
          update: () => {
            return Promise.reject(new Error("Erreur 404"))
          }
        }
      })
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    // 50 Server Error- is an HTTP response code for an internal service error. This means that the server has encountered a situation that it does not know how to resolve.
    test("fetches bills from an API and fails with 500 message error", async () => {
      document.body.innerHTML = BillsUI({ error: "Erreur 500" })
      mockStore.bills.mockImplementationOnce(() => {
        return {
          update: () => {
            return Promise.reject(new Error("Erreur 404"))
          }
        }
      }
      )
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })

  })
})








/* 
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then when i click the submit button , the submit shoud be handled", () => {

      document.body.innerHTML = NewBillUI()
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

    // test post whith the function create
    test("NewBills from mock API POST", async () => {
      //jest.spyOn(object, methodName)

      const getSpy = jest.spyOn(mockStore, "bills")
      const bill = await bills.update()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(bill.data.length).toBe(4)
    })


//ql ;eu
     test("fetches bills from an API and fails with 404 message error", async () => {
       //When the mocked function lacks implementations set with .mockImplementationOnce(), it will run the default implementation set with jest.fn(() => defaultValue) or .mockImplementation(() => defaultValue) if they have been called 
       mockStore.bills.create().mockImplementationOnce(() =>
         Promise.reject(new Error("Erreur 404"))
       )
       const html = BillsUI({ error: "Erreur 404" })
       document.body.innerHTML = html
       const message = await screen.getByText(/Erreur 404/)
       expect(message).toBeTruthy()
     })


    test("fetches bills from an API and fails with 404 message error", async () => {
      document.body.innerHTML = NewBillUI()
      mockStore.bills.mockImplementationOnce(() => {
        return {
          create: () => { // or use create method
            return Promise.reject(new Error("Erreur 404"))
          }
        }
      })
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    });


    test("fetches messages from an API and fails with 500 message error", async () => {
      mockStore.bills.create().mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
 */
