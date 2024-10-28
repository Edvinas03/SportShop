import { useEffect, useState } from "react"
import { IStudent } from "@/interfaces/IStudent";
import { getApi, putApi, postApi, deleteApi } from "@/api";
import { Modal } from "@/pages/components/Modal";
import { StudentForm } from "./components/StudentForm";
import { StudentList } from "./components/StudentList";
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Students() {
    const [students, setStudents] = useState<IStudent[]>([])
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [editStudent, setEditStudent] = useState<IStudent | undefined>()
    const [createStudent, setCreateStudent] = useState<boolean>(false)
    const [viewStudents, setViewStudents] = useState<boolean>(false);

    const getStudents = () => getApi<IStudent[]>('students').then(s => s && setStudents(s))
    const storeStudent = (student: IStudent) => {
        setVisibleModal(false)
        if (student.id) {
            putApi(`students/${student.id}`, student)
                .then(r => getStudents()).then(i => i)
        } else {
            const { id, ...newStudent } = student
            postApi('students', newStudent).then(() => getStudents());
        }
    }

    const deleteStudent = (id: number) => {
        deleteApi(`students/${id}`, {}).then(() => getStudents());
    }
    const editHandler = (student: IStudent) => {
        setEditStudent(student)
        setVisibleModal(true)
        setCreateStudent(false)
        setViewStudents(false)
    }
    const createHandler = () => {
        setEditStudent(undefined)
        setCreateStudent(true)
        setVisibleModal(true)
        setViewStudents(false)
    }
    const viewStudentsHandler = () => {
        setEditStudent(undefined)
        setCreateStudent(false)
        setViewStudents(true)
        setVisibleModal(true)
    };

    useEffect(() => {
        getStudents().then(i => i)
    }, []);

    return <div>
        {
            visibleModal ? <Modal visibleModal={visibleModal} setVisibleModal={setVisibleModal} title={createStudent ? 'Naujas studentas' : viewStudents ? 'Studentų sąrašas' : 'Studentų forma'}>
                {viewStudents ? (<StudentList students={students} setVisibleModal={setVisibleModal} />) :
                    (<StudentForm storeStudent={storeStudent} student={editStudent} />)}
            </Modal> : null
        }
        <div className="text-3xl">Students</div>
        <button type="button" onClick={createHandler} className="mb-4 bg-gray-500 text-white py-2 px-4 rounded">Pridėti naują studentą</button>
        <div>{
            students.map(student => <div key={student.id}><button type="button" onClick={() => editHandler(student)}>{student.firstName} {student.lastName}</button> {student.email}
                <button type="button" onClick={viewStudentsHandler}><EyeIcon className="h-4 w-4 text-white-500" /></button>
                <button type="button" onClick={() => deleteStudent(student.id)}><TrashIcon className="h-4 w-4 text-white-500" /></button>
            </div>)
        }</div>
    </div>
}