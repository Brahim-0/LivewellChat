import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={`container ${styles.main}`}>
      <div className="text-center mt-5">
        <h1 className={`display-1 ${styles.titleLivewell}`}>Livewell Community</h1>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <a href="/signup" style={stylesmain.logoutButton} >Sign Up</a>
          <a href="/login" style={stylesmain.logoutButton} >Login</a></div>
      </div>
    </main>
  );

}
const stylesmain = {

logoutButton: {
  padding: '8px 16px',
  background: '#ff6347',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  outline: 'none',
  marginBottom: "10px",
  marginLeft: "10px"
},
}