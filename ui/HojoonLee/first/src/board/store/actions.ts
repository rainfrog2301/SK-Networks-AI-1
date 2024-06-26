    import { ActionContext } from "vuex"
    import { Board, BoardState } from "./states"
    import { AxiosResponse } from "axios"
    import axiosInst from "@/utility/axiosInstance"
    import { REQUEST_BOARD_LIST_TO_DJANGO } from "./mutation-types"
    export type BoardActions = {
        requestBoardToDjango(context: ActionContext<BoardState, any>, boardId: number): Promise<void>
        requestBoardListToDjango(context: ActionContext<BoardState, any>): Promise<void>
        requestCreateBoardToDjango(context: ActionContext<BoardState, any>, payload: {
            title: string, writer: string, content: string
        }): Promise<AxiosResponse>
        requestDeleteBoardToDjango(context: ActionContext<BoardState, unknown>, boardId: number): Promise<void>
        requestModifyBoardToDjango(context: ActionContext<BoardState, any>, payload: {
            title: string, content: string, boardId: number
        }): Promise<void>
    }

    const actions: BoardActions = {
        // `` (백틱)을 쓰는 이유: fstring 처럼 {}안에 있는 것을 변수처럼 받아와서 str화 하기 위해
        async requestBoardToDjango(context: ActionContext<BoardState, any>, boardId: number): Promise<void> {
            try {
                const res: AxiosResponse<Board> = await axiosInst.djangoAxiosInst.get(`/board/read/${boardId}`)
                console.log('data:', res.data)
                context.commit('REQUEST_BOARD_TO_DJANGO', res.data)
            } catch (error) {
                console.error('requestBoardToDjango(): ' + error)
                throw error
            }
        },
        async requestBoardListToDjango(context: ActionContext<BoardState, any>): Promise<void> {
            try {
                const res: AxiosResponse<any, any> = 
                    await axiosInst.djangoAxiosInst.get('/board/list')
                
                const data: Board[] = res.data
                context.commit('REQUEST_BOARD_LIST_TO_DJANGO', data)
            } catch (error) {
                console.error('requestBoardListToDjango(): ' + error)
                throw error
            }
        },
        // async, Promise는 추후에 논의
        // 파라미터로 전달된 payload 외의 ActionContext 라는 것이 존재함
        // 현재 Vue에서 구동하는 action의 상태값을 관리하기 위해 사용
        // 이 context 객체를 사용하여 mutations를 호출 할 수 있음
        // mutations를 호출하는 방식은 위의 list 케이스와 동일하게 context.commit()으로 호출함
        async requestCreateBoardToDjango(context: ActionContext<BoardState, unknown>, payload: {
            title: string, writer: string, content: string
        }): Promise<AxiosResponse> {
            const { title, writer, content } = payload
            console.log('전송할 데이터:', { title, writer, content })
            try {
                // HTTP 통신을 진행할 때 유의할 사항이 있음
                // GET 방식과 POST 방식이 존재하는데
                // GET 방식은 URL에 모든 정보들이 노출됨
                // POST 방식은 URL에 정보가 노출되지 않고 데이터가 숨겨져서 보내짐
                // 고로 개인정보나 민감한 데이터의 경우 반드시 POST로 전송할 필요가 있음
                // 보낼 때 첫 번째 인자가 '요청할 경로', 두 번째 인자는 데이터 형태로 보내집니다.
                // 장고쪽에서 post 보낸걸 받기 위해 파이참의 urls.py로 ㄱㄱ
                const res: AxiosResponse = await axiosInst.djangoAxiosInst.post(
                    '/board/register', { title, writer, content})
    
                console.log('res:', res.data)
                return res.data
            } catch (error) {
                alert('requestCreateBoardToDjango() 문제 발생!')
                throw error
            }
        },
        async requestDeleteBoardToDjango(context: ActionContext<BoardState, unknown>, boardId: number): Promise<void> {
            try {
                console.log('requestDeleteBoardToDjango')
                // HTTP 상으로 DELETE 요청을 전송함
                await axiosInst.djangoAxiosInst.delete(`/board/delete/${boardId}`)
            }catch (error) {
                console.log('requestDeleteBoardToDjango() 과정에서 문제 발생')
                throw error
            }
        },
        async requestModifyBoardToDjango(context: ActionContext<BoardState, any>, payload: {
            title: string, content: string, boardId: number
        }): Promise<void> {
            const { title, content, boardId } = payload
            // 요청
            try {
                // 수정을 요청할 때는 put을 사용함
                // 여기에 잇는 것중 title, content만 수정하겠다.
                await axiosInst.djangoAxiosInst.put(`/board/modify/${boardId}`, {title, content})
                console.log('수정 성공!')
            }catch (error) {
                console.log('requestModifyBoardToDjango() 과정에서 문제 발생')
                throw error
            }
        },
    }

    export default actions