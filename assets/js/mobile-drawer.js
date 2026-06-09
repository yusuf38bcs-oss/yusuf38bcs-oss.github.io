document.addEventListener("DOMContentLoaded", function () {

  const masthead = document.querySelector(".neural-site-masthead");
  const toggleBtn = document.getElementById("neural-mobile-toggle");
  const drawer = document.getElementById("neural-mobile-drawer");

  if (!toggleBtn || !masthead || !drawer) return;

  function setOpen(isOpen) {
    masthead.classList.toggle("is-active-drawer", isOpen);
    toggleBtn.setAttribute(
    "aria-expanded",
    isOpen ? "true" : "false"
);
    drawer.setAttribute("aria-hidden", !isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  toggleBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    setOpen(!masthead.classList.contains("is-active-drawer"));
  });

  drawer.querySelectorAll("a").forEach(function(link){
    link.addEventListener("click", function(){
      setOpen(false);
    });
  });

  document.addEventListener("click", function(e){
    if(!masthead.contains(e.target)){
      setOpen(false);
    }
  });

  document.addEventListener("keydown", function(e){
    if(e.key==="Escape"){
      setOpen(false);
    }
  });

});
