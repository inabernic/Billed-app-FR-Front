/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills.js"
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //expect expression
      expect(windowIcon.classList.contains('active-icon')).toBe(true)


    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})

describe('Given I am connected as Employée and I am on Bills page and I clicked on a Action bill', () => {
  describe('When I click on the icon eye', () => {
    test('A modal should open', () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const bill = new Bills({
        document, onNavigate, mockStore: null, localStorage: window.localStorage
      })
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const icons = screen.getAllByTestId('icon-eye')
      const handleClickIconEye1 = jest.fn((e) => bill.handleClickIconEye(icons[0]))
      icons[0].addEventListener("click", handleClickIconEye1)
      fireEvent.click((icons[0]))
      expect(handleClickIconEye1).toHaveBeenCalled()
      const modale = screen.getByTestId('modaleFile')
      expect(modale).toBeTruthy()
    })
  })
})

// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Page Bills", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getAllByTestId("title-content"))
      const contentType = await screen.getAllByText("Type")
      expect(contentType).toBeTruthy()
      // TestingLibraryElementError: Found multiple elements with the text: Nom
      const contentNom = await screen.getAllByText("Nom")
      expect(contentNom).toBeTruthy()
      const contentDate = await screen.getAllByText("Date")
      expect(contentDate).toBeTruthy()
      const contentMontant = await screen.getAllByText("Montant")
      expect(contentMontant).toBeTruthy()
      const contentStatut = await screen.getAllByText("Statut")
      expect(contentStatut).toBeTruthy()
      expect(screen.getAllByTestId("icon-eye")).toBeTruthy()
      expect(screen.getAllByTestId("btn-new-bill")).toBeTruthy()
    })
  })
})

